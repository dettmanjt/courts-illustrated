"""Builds src/data/content.json for the Best Of page.

Every video, article and FAQ on the site gets a 0-100 score, mostly from the
Endless Customers "Big 5" (cost, problems, comparisons, reviews, best-of):
the topics buyers search for most. Run: python3 scripts/build_content.py
"""
import json, re, glob, math, html, datetime

TODAY = datetime.date(2026, 11, 25)

def frontmatter(path):
    fm = open(path).read().split('\n---', 1)[0]
    data = {}
    for line in fm.splitlines():
        m = re.match(r'^([a-zA-Z]+):\s*(.*)$', line)
        if not m: continue
        k, v = m.groups()
        v = re.sub(r'\s+#.*$', '', v).strip()
        try: data[k] = json.loads(v)
        except Exception: data[k] = v.strip('"')
    return data

# Big 5 + supporting topics, checked in order; first match wins.
TOPICS = [
    ('Cost & pricing', 45, r'\b(cost|price|pricing|budget|how much|\$|afford|financ)'),
    ('Comparisons', 40, r'\b(vs\.?|versus|compared|compare|or not|which|right for (me|you))\b'),
    ('Problems & fixes', 40, r'\b(crack|problem|fix|repair|rehab|renovat|damage|flood|fail|slope|drain|maintenance|resurfac|restor)'),
    ('Best of', 35, r'\b(best|top \d|ultimate|what actually matters)\b'),
    ('Reviews & stories', 30, r'\b(review|testimonial|became the heart|story|with (former|dominique))\b'),
    ('How-to & planning', 30, r'\b(how to|how do|what is|what to|guide|dimension|size|space|plan|design|choos|consider|build(ing)? (a|you|your)|start|know before|can )'),
    ('Project showcase', 20, r'.'),
]
SPORTS = [
    ('Pickleball', r'pickleball'),
    ('Basketball', r'basketball|hoop|goal|half[- ]court|shooting court|ballers|dunk|dribbl|hawks'),
    ('Tennis', r'tennis'),
    ('Volleyball', r'volleyball'),
    ('Indoor & gym floors', r'gym|indoor|floor|wall pad|sport court maple'),
    ('Hockey', r'hockey'),
    ('Multi-sport', r'multi|game court|sport court|backyard court|bocce|futsal|padel|putting|court of the month'),
]
PROMO = r'(contact|turnkey|custom court construction|custom multi-sport courts in|delivered|logo installation|complete$|camps|park$|school|elementary)'

def classify(title):
    t = title.lower()
    topic, pts = next((n, p) for n, p, rx in TOPICS if re.search(rx, t))
    if topic == 'Project showcase' and re.search(PROMO, t): pts = 12
    sports = [n for n, rx in SPORTS if re.search(rx, t)] or ['Multi-sport']
    return topic, pts, sports

def specificity(title):
    t = title.lower(); s = 0
    if '?' in title or re.match(r'^(how|what|which|why|can|do|is|should)\b', t): s += 4
    if re.search(r'\d', title): s += 3
    if re.search(r'\b(texas|austin|las vegas|nevada|arizona|georgia|st\. louis|dallas|san antonio|ohio)\b', t): s += 3
    return min(s, 10)

def freshness(date):
    if not date: return 5
    d = datetime.date.fromisoformat(date); yrs = (TODAY - d).days / 365
    return 10 if yrs < 1 else 7 if yrs < 2 else 4 if yrs < 5 else 1

def engagement(views):
    if views is None: return 8          # unknown (articles, FAQs)
    return round(min(20, 20 * math.log10(views + 1) / 4))   # 10k views = full marks

FORMAT = {'Video': 15, 'Article': 12, 'FAQ': 10}

companies = {p.split('/')[-1][:-3]: frontmatter(p) for p in glob.glob('src/content/companies/*.md')}
builders = {p.split('/')[-1][:-3]: frontmatter(p) for p in glob.glob('src/content/builders/*.md')}
live = {k for k, c in companies.items() if c.get('published') is True}

videos = {}
for line in open('scripts/videos.tsv'):
    vid, views, date, title = line.rstrip('\n').split('\t')
    videos[vid] = (int(views), date or None, html.unescape(title))

items, seen = [], set()
def add(kind, title, url, company, builder=None, views=None, date=None, extra=None):
    if url in seen or company not in live: return
    seen.add(url)
    topic, tpts, sports = classify(title + ' ' + (extra or ''))
    parts = {'topic': tpts, 'format': FORMAT[kind], 'engagement': engagement(views),
             'specificity': specificity(title), 'freshness': freshness(date)}
    items.append({'type': kind, 'title': title, 'url': url, 'company': company,
                  'builder': builder, 'topic': topic, 'sports': sports, 'views': views,
                  'date': date, 'score': sum(parts.values()), 'parts': parts, 'text': extra})

for slug, b in builders.items():
    if b.get('published') is not True: continue
    for vid in b.get('videoIds', []) or []:
        if vid in videos:
            v, d, t = videos[vid]
            add('Video', t, f'https://www.youtube.com/watch?v={vid}', b['company'], slug, v, d)
for slug, c in companies.items():
    for vid in c.get('videoIds', []) or []:
        if vid in videos:
            v, d, t = videos[vid]
            add('Video', t, f'https://www.youtube.com/watch?v={vid}', slug, None, v, d)
    for a in c.get('articles', []) or []:
        add('Article', a['title'], a['url'], slug, extra=a.get('summary'))
    for i, f in enumerate(c.get('faqs', []) or []):
        add('FAQ', f['q'], f'/companies/{slug}#faq-{i + 1}', slug, extra=f['a'])

items.sort(key=lambda x: -x['score'])
json.dump(items, open('src/data/content.json', 'w'), indent=1)
print(len(items), 'items;', {k: sum(1 for i in items if i['type'] == k) for k in FORMAT})
for i in items[:12]: print(i['score'], i['type'], i['topic'], '|', i['title'][:70])
