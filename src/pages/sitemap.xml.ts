import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://courtsillustrated.com';
  const companies = await getCollection('companies', (c) => c.data.published);
  const live = new Set(companies.map((c) => c.slug));
  const builders = await getCollection('builders', (b) => b.data.published && live.has(b.data.company.slug));
  const urls = [
    { loc: '/', pri: '1.0' }, { loc: '/best', pri: '0.9' }, { loc: '/join', pri: '0.5' },
    ...companies.map((c) => ({ loc: `/companies/${c.slug}`, pri: '0.8', mod: c.data.checkedOn })),
    ...builders.map((b) => ({ loc: `/builders/${b.slug}`, pri: '0.7' })),
  ];
  const body = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.map((u) => `  <url><loc>${base}${u.loc}</loc>${u.mod ? `<lastmod>${u.mod}</lastmod>` : ''}<priority>${u.pri}</priority></url>`).join('\n')}
</urlset>`;
  return new Response(body, { headers: { 'Content-Type': 'application/xml; charset=utf-8' } });
};
