// Courts Illustrated Worker: serves the static site, saves form submissions to D1,
// sends notification emails, and runs the private /admin CRM (behind Cloudflare Access).

const ADMIN_EMAIL = 'jt@swcourts.com';
const FROM = 'Courts Illustrated <notifications@courtsillustrated.com>';

const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS contacts (
    id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT, email TEXT, phone TEXT, zip TEXT, court_type TEXT, timeline TEXT, message TEXT,
    builder TEXT, page TEXT, status TEXT NOT NULL DEFAULT 'new', notes TEXT DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS builder_submissions (
    id INTEGER PRIMARY KEY AUTOINCREMENT, created_at TEXT NOT NULL DEFAULT (datetime('now')),
    name TEXT, email TEXT, company TEXT, data TEXT, status TEXT NOT NULL DEFAULT 'new', notes TEXT DEFAULT '')`,
  `CREATE TABLE IF NOT EXISTS builder_emails (slug TEXT PRIMARY KEY, email TEXT NOT NULL)`,
];

let schemaReady = false;
async function ensureSchema(db) {
  if (schemaReady) return;
  await db.batch(SCHEMA.map((s) => db.prepare(s)));
  schemaReady = true;
}

const json = (data, status = 200) =>
  new Response(JSON.stringify(data), { status, headers: { 'content-type': 'application/json' } });

const clean = (v, max = 2000) => String(v ?? '').trim().slice(0, max);
const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));

async function readBody(request) {
  const type = request.headers.get('content-type') || '';
  if (type.includes('application/json')) return await request.json();
  return Object.fromEntries(await request.formData());
}

// ---------- email (Resend). Skipped quietly until RESEND_API_KEY is set. ----------
async function sendEmail(env, to, subject, text, replyTo) {
  if (!env.RESEND_API_KEY || !to.length) return false;
  const res = await fetch('https://api.resend.com/emails', {
    method: 'POST',
    headers: { authorization: `Bearer ${env.RESEND_API_KEY}`, 'content-type': 'application/json' },
    body: JSON.stringify({ from: env.MAIL_FROM || FROM, to, subject, text, reply_to: replyTo || undefined }),
  });
  return res.ok;
}

const lines = (obj) => Object.entries(obj).filter(([, v]) => v).map(([k, v]) => `${k}: ${v}`).join('\n');

// ---------- public form handlers ----------
async function handleContact(request, env) {
  const b = await readBody(request);
  if (b.company_website) return json({ ok: true }); // honeypot
  const c = {
    name: clean(b.name, 120), email: clean(b.email, 200), phone: clean(b.phone, 40), zip: clean(b.zip, 10),
    court_type: clean(b.court_type, 60), timeline: clean(b.timeline, 60), message: clean(b.message, 4000),
    builder: clean(b.builder, 80).replace(/[^a-z0-9-]/g, ''), page: clean(b.page, 300),
  };
  if (!c.name || !isEmail(c.email)) return json({ ok: false, error: 'Please add your name and a valid email.' }, 400);
  await env.DB.prepare(
    'INSERT INTO contacts (name,email,phone,zip,court_type,timeline,message,builder,page) VALUES (?,?,?,?,?,?,?,?,?)'
  ).bind(c.name, c.email, c.phone, c.zip, c.court_type, c.timeline, c.message, c.builder, c.page).run();

  const body = lines({ Name: c.name, Email: c.email, Phone: c.phone, ZIP: c.zip, 'Court type': c.court_type,
    Timeline: c.timeline, Builder: c.builder, Page: c.page }) + (c.message ? `\n\n${c.message}` : '');
  const to = [env.ADMIN_EMAIL || ADMIN_EMAIL];
  if (c.builder) {
    const row = await env.DB.prepare('SELECT email FROM builder_emails WHERE slug = ?').bind(c.builder).first();
    if (row?.email) to.push(row.email);
  }
  await sendEmail(env, to, `New court inquiry from ${c.name}${c.zip ? ` (${c.zip})` : ''}`,
    `Someone asked to talk to a builder on Courts Illustrated.\n\n${body}\n\nReply to this email to reach them.`, c.email);
  return json({ ok: true });
}

const JOIN_FIELDS = ['name', 'title', 'company', 'company_url', 'email', 'phone', 'headshot', 'bio', 'courts', 'years',
  'certs', 'court_types', 'service_area', 'website', 'instagram', 'facebook', 'youtube', 'tiktok', 'linkedin', 'x',
  'videos', 'articles', 'reviews', 'license', 'notes'];

async function handleJoin(request, env) {
  const b = await readBody(request);
  if (b.company_website) return json({ ok: true }); // honeypot
  const d = {};
  for (const k of JOIN_FIELDS) d[k] = clean(b[k], k === 'bio' || k === 'reviews' ? 6000 : 1000);
  if (!d.name || !d.company || !isEmail(d.email)) return json({ ok: false, error: 'Name, company and a valid email are required.' }, 400);
  if (!b.consent) return json({ ok: false, error: 'Please confirm the consent box.' }, 400);
  await env.DB.prepare('INSERT INTO builder_submissions (name,email,company,data) VALUES (?,?,?,?)')
    .bind(d.name, d.email, d.company, JSON.stringify(d)).run();
  await sendEmail(env, [env.ADMIN_EMAIL || ADMIN_EMAIL], `New builder profile: ${d.name}, ${d.company}`,
    `A builder submitted a profile for review.\n\n${lines(d)}\n\nReview it at https://courtsillustrated.com/admin`, d.email);
  return json({ ok: true });
}

// ---------- Cloudflare Access check for /admin ----------
let jwks = null;
const b64u = (s) => Uint8Array.from(atob(s.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(s.length / 4) * 4, '=')), (c) => c.charCodeAt(0));

async function accessEmail(request, env) {
  const token = request.headers.get('cf-access-jwt-assertion');
  if (!token || !env.ACCESS_TEAM || !env.ACCESS_AUD) return null;
  const [h, p, s] = token.split('.');
  if (!s) return null;
  const header = JSON.parse(new TextDecoder().decode(b64u(h)));
  const payload = JSON.parse(new TextDecoder().decode(b64u(p)));
  if (!jwks) jwks = (await (await fetch(`https://${env.ACCESS_TEAM}.cloudflareaccess.com/cdn-cgi/access/certs`)).json()).keys;
  let jwk = jwks.find((k) => k.kid === header.kid);
  if (!jwk) { jwks = null; return null; }
  const key = await crypto.subtle.importKey('jwk', jwk, { name: 'RSASSA-PKCS1-v1_5', hash: 'SHA-256' }, false, ['verify']);
  const ok = await crypto.subtle.verify('RSASSA-PKCS1-v1_5', key, b64u(s), new TextEncoder().encode(`${h}.${p}`));
  const aud = Array.isArray(payload.aud) ? payload.aud : [payload.aud];
  if (!ok || !aud.includes(env.ACCESS_AUD) || payload.exp * 1000 < Date.now()) return null;
  const email = String(payload.email || '').toLowerCase();
  return email === (env.ADMIN_EMAIL || ADMIN_EMAIL).toLowerCase() ? email : null;
}

// ---------- admin API ----------
const TABLES = { contacts: 'contacts', builders: 'builder_submissions' };
const STATUSES = ['new', 'contacted', 'in review', 'verified', 'published', 'closed', 'spam'];

function csv(rows) {
  if (!rows.length) return '';
  const cols = Object.keys(rows[0]);
  const q = (v) => `"${String(v ?? '').replace(/"/g, '""')}"`;
  return [cols.join(','), ...rows.map((r) => cols.map((c) => q(r[c])).join(','))].join('\n');
}

async function handleAdminApi(request, env, url) {
  const path = url.pathname.replace('/api/admin/', '');
  if (path === 'list' || path === 'export') {
    const table = TABLES[url.searchParams.get('type')];
    if (!table) return json({ error: 'bad type' }, 400);
    const { results } = await env.DB.prepare(`SELECT * FROM ${table} ORDER BY id DESC LIMIT 1000`).all();
    if (path === 'list') return json(results);
    return new Response(csv(results), { headers: { 'content-type': 'text/csv',
      'content-disposition': `attachment; filename="ci-${url.searchParams.get('type')}.csv"` } });
  }
  if (path === 'update' && request.method === 'POST') {
    const b = await request.json();
    const table = TABLES[b.type];
    if (!table || !Number.isInteger(b.id)) return json({ error: 'bad request' }, 400);
    if (b.status !== undefined && !STATUSES.includes(b.status)) return json({ error: 'bad status' }, 400);
    await env.DB.prepare(`UPDATE ${table} SET status = COALESCE(?, status), notes = COALESCE(?, notes) WHERE id = ?`)
      .bind(b.status ?? null, b.notes === undefined ? null : clean(b.notes, 8000), b.id).run();
    return json({ ok: true });
  }
  if (path === 'builder-emails') {
    if (request.method === 'POST') {
      const b = await request.json();
      const slug = clean(b.slug, 80).replace(/[^a-z0-9-]/g, '');
      if (!slug) return json({ error: 'bad slug' }, 400);
      if (b.email) {
        if (!isEmail(b.email)) return json({ error: 'bad email' }, 400);
        await env.DB.prepare('INSERT INTO builder_emails (slug,email) VALUES (?,?) ON CONFLICT(slug) DO UPDATE SET email = excluded.email').bind(slug, clean(b.email, 200)).run();
      } else {
        await env.DB.prepare('DELETE FROM builder_emails WHERE slug = ?').bind(slug).run();
      }
      return json({ ok: true });
    }
    const { results } = await env.DB.prepare('SELECT * FROM builder_emails ORDER BY slug').all();
    return json(results);
  }
  return json({ error: 'not found' }, 404);
}

export default {
  async fetch(request, env) {
    const url = new URL(request.url);
    const p = url.pathname;
    try {
      if (p.startsWith('/api/') || p === '/admin' || p.startsWith('/admin/')) await ensureSchema(env.DB);
      if (p === '/api/contact' && request.method === 'POST') return await handleContact(request, env);
      if (p === '/api/join' && request.method === 'POST') return await handleJoin(request, env);
      if (p === '/admin' || p.startsWith('/admin/') || p.startsWith('/api/admin/')) {
        const who = await accessEmail(request, env);
        if (!who) return new Response('Not authorized.', { status: 401 });
        if (p.startsWith('/api/admin/')) return await handleAdminApi(request, env, url);
        return new Response(ADMIN_HTML.replace('{{EMAIL}}', esc(who)), { headers: { 'content-type': 'text/html; charset=utf-8', 'cache-control': 'no-store' } });
      }
      if (p.startsWith('/api/')) return json({ error: 'not found' }, 404);
    } catch (e) {
      return json({ ok: false, error: 'Something went wrong. Please try again.' }, 500);
    }
    return env.ASSETS.fetch(request);
  },
};

const ADMIN_HTML = `<!doctype html><html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1"><meta name="robots" content="noindex">
<title>CI Admin</title>
<style>
:root{--ink:#111;--paper:#FAFAF7;--line:#ddd;--mute:#666;--accent:#0f8a80}
*{box-sizing:border-box}body{margin:0;font:15px/1.5 -apple-system,'Segoe UI',Inter,Arial,sans-serif;background:var(--paper);color:var(--ink)}
header{background:var(--ink);color:#fff;padding:14px 20px;display:flex;justify-content:space-between;align-items:center;gap:12px;flex-wrap:wrap}
header b{font-size:18px;letter-spacing:.06em;text-transform:uppercase}header span{color:#aaa;font-size:13px}
nav{display:flex;gap:6px;padding:14px 20px 0;flex-wrap:wrap}
nav button,.btn{font:inherit;font-size:14px;border:2px solid var(--ink);background:#fff;padding:7px 14px;cursor:pointer}
nav button[aria-pressed=true]{background:var(--ink);color:#fff}
main{padding:16px 20px 40px}.bar{display:flex;gap:10px;align-items:center;margin-bottom:12px;flex-wrap:wrap}
.bar select,.bar input{font:inherit;padding:6px 8px;border:1px solid #bbb}
.card{background:#fff;border:1px solid var(--line);padding:14px 16px;margin-bottom:10px}
.card h3{margin:0 0 2px;font-size:17px}.meta{color:var(--mute);font-size:13px}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:4px 18px;margin:10px 0;font-size:14px}
.grid div{overflow-wrap:anywhere}.grid i{font-style:normal;color:var(--mute);font-size:12px;text-transform:uppercase;letter-spacing:.06em;display:block}
.msg{white-space:pre-wrap;background:#f6f6f2;padding:10px;margin:8px 0;font-size:14px}
.row{display:flex;gap:10px;align-items:flex-start;flex-wrap:wrap}textarea{font:inherit;width:100%;min-height:60px;padding:8px;border:1px solid #bbb}
.pill{display:inline-block;font-size:12px;padding:2px 8px;border-radius:99px;background:#eee;margin-left:6px}
.pill.new{background:var(--accent);color:#fff}.empty{color:var(--mute);padding:30px 0}
table{border-collapse:collapse;width:100%;max-width:640px}td,th{text-align:left;padding:6px;border-bottom:1px solid var(--line)}
.saved{color:var(--accent);font-size:13px}
</style></head><body>
<header><b>Courts Illustrated CRM</b><span>Signed in as {{EMAIL}}</span></header>
<nav><button data-t="contacts" aria-pressed="true">Contacts</button><button data-t="builders" aria-pressed="false">Builder submissions</button><button data-t="emails" aria-pressed="false">Builder emails</button></nav>
<main id="main"></main>
<script>
const STATUSES=${JSON.stringify(STATUSES)};
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const link=v=>/^https?:\\/\\//.test(v)?'<a href="'+esc(v)+'" target="_blank" rel="noopener">'+esc(v)+'</a>':esc(v);
let tab='contacts',rows=[],filter='open';
const main=document.getElementById('main');
document.querySelectorAll('nav button').forEach(b=>b.onclick=()=>{tab=b.dataset.t;document.querySelectorAll('nav button').forEach(x=>x.setAttribute('aria-pressed',x===b));load();});
async function load(){
  if(tab==='emails')return loadEmails();
  rows=await (await fetch('/api/admin/list?type='+tab)).json();render();
}
function render(){
  const list=rows.filter(r=>filter==='all'||(filter==='open'?!['closed','spam','published'].includes(r.status):r.status===filter));
  main.innerHTML='<div class="bar"><label>Show <select id="f">'+['open','all',...STATUSES].map(s=>'<option'+(s===filter?' selected':'')+'>'+s+'</option>').join('')+'</select></label>'+
    '<span class="meta">'+list.length+' of '+rows.length+'</span><a class="btn" href="/api/admin/export?type='+tab+'">Export CSV</a></div>'+
    (list.length?list.map(card).join(''):'<p class="empty">Nothing here yet.</p>');
  document.getElementById('f').onchange=e=>{filter=e.target.value;render();};
  main.querySelectorAll('[data-id]').forEach(el=>{
    const id=+el.dataset.id;
    el.querySelector('select').onchange=e=>save(id,{status:e.target.value},el);
    el.querySelector('.savenote').onclick=()=>save(id,{notes:el.querySelector('textarea').value},el);
  });
}
function card(r){
  let fields;
  if(tab==='contacts'){
    fields={Email:r.email,Phone:r.phone,ZIP:r.zip,'Court type':r.court_type,Timeline:r.timeline,Builder:r.builder,Page:r.page};
  }else{
    const d=JSON.parse(r.data||'{}');fields={};
    for(const[k,v]of Object.entries(d))if(v&&!['name','bio','reviews','videos','articles','notes'].includes(k))fields[k.replace(/_/g,' ')]=v;
    r._long=['bio','videos','articles','reviews','notes'].filter(k=>d[k]).map(k=>'<i class="meta">'+k+'</i><div class="msg">'+esc(d[k])+'</div>').join('');
  }
  return '<div class="card" data-id="'+r.id+'"><h3>'+esc(r.name)+(r.company?' · '+esc(r.company):'')+'<span class="pill '+esc(r.status)+'">'+esc(r.status)+'</span></h3>'+
    '<div class="meta">#'+r.id+' · '+esc(r.created_at)+' UTC</div>'+
    '<div class="grid">'+Object.entries(fields).filter(([,v])=>v).map(([k,v])=>'<div><i>'+esc(k)+'</i>'+(k==='Email'||k==='email'?'<a href="mailto:'+esc(v)+'">'+esc(v)+'</a>':link(v))+'</div>').join('')+'</div>'+
    (r.message?'<div class="msg">'+esc(r.message)+'</div>':'')+(r._long||'')+
    '<div class="row"><label>Status <select>'+STATUSES.map(s=>'<option'+(s===r.status?' selected':'')+'>'+s+'</option>').join('')+'</select></label></div>'+
    '<textarea placeholder="Notes">'+esc(r.notes)+'</textarea><button class="btn savenote">Save notes</button> <span class="saved"></span></div>';
}
async function save(id,patch,el){
  const res=await fetch('/api/admin/update',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify({type:tab,id,...patch})});
  el.querySelector('.saved').textContent=res.ok?'Saved':'Save failed';
  const r=rows.find(x=>x.id===id);if(res.ok&&r)Object.assign(r,patch);
  if(patch.status){el.querySelector('.pill').textContent=patch.status;el.querySelector('.pill').className='pill '+patch.status;}
}
async function loadEmails(){
  const list=await (await fetch('/api/admin/builder-emails')).json();
  main.innerHTML='<p class="meta">When a buyer asks to talk to a specific builder, the inquiry goes to you and to the email listed here for that builder. Use the builder\\'s page address, e.g. <b>jt-dettman</b>.</p>'+
    '<table><tr><th>Builder (slug)</th><th>Email</th><th></th></tr>'+list.map(r=>'<tr><td>'+esc(r.slug)+'</td><td>'+esc(r.email)+'</td><td><button class="btn" data-del="'+esc(r.slug)+'">Remove</button></td></tr>').join('')+
    '<tr><td><input id="ns" placeholder="jt-dettman"></td><td><input id="ne" placeholder="name@company.com"></td><td><button class="btn" id="add">Add</button></td></tr></table>';
  const post=b=>fetch('/api/admin/builder-emails',{method:'POST',headers:{'content-type':'application/json'},body:JSON.stringify(b)}).then(loadEmails);
  document.getElementById('add').onclick=()=>post({slug:document.getElementById('ns').value,email:document.getElementById('ne').value});
  main.querySelectorAll('[data-del]').forEach(b=>b.onclick=()=>post({slug:b.dataset.del}));
}
load();
</script></body></html>`;
