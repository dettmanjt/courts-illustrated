// llms.txt: a plain-text map of the site for AI assistants (https://llmstxt.org).
import { getCollection } from 'astro:content';
import type { APIRoute } from 'astro';
import { score } from '../lib/score';
import items from '../data/content.json';

export const GET: APIRoute = async ({ site }) => {
  const base = site?.href.replace(/\/$/, '') ?? 'https://courtsillustrated.com';
  const companies = await getCollection('companies', (c) => c.data.published);
  const live = new Set(companies.map((c) => c.slug));
  const builders = (await getCollection('builders', (b) => b.data.published && live.has(b.data.company.slug)))
    .sort((a, b) => score(b.data).total - score(a.data).total);
  const lines = [
    '# Courts Illustrated',
    '',
    '> A directory of verified court builders (pickleball, basketball, tennis, multi-sport courts and gym floors) in the United States, with builder rankings, published pricing, buyer FAQs and the best educational content from each builder. Facts about each company come from its own website and are dated.',
    '',
    'Rankings: each builder gets a 0-100 Courts Illustrated score (40 points courts built, 25 years building, 20 certifications, 15 published content). Company score is the average of its builders. Verification status is shown on each profile.',
    '',
    '## Companies',
    ...companies.map((c) => {
      const d = c.data;
      const bits = [d.region, d.founded && `founded ${d.founded}`, d.phone, d.stats[0]].filter(Boolean).join('; ');
      return `- [${d.name}](${base}/companies/${c.slug}): ${bits}`;
    }),
    '',
    '## Builders',
    ...builders.map((b) => {
      const c = companies.find((x) => x.slug === b.data.company.slug)!.data;
      return `- [${b.data.name}](${base}/builders/${b.slug}): ${b.data.role} at ${c.name}, ${c.region}. CI score ${score(b.data).total}.`;
    }),
    '',
    '## Published court pricing (as stated by each builder)',
    ...companies.flatMap((c) => c.data.prices.map((p) => `- ${c.data.name} (${c.data.region}): ${p.label}: ${p.text}`)),
    '',
    '## Best content (ranked)',
    `- [Full ranked list](${base}/best)`,
    ...items.slice(0, 25).map((i: any) => `- [${i.title}](${i.url.startsWith('/') ? base + i.url : i.url}) (${i.type}, ${i.topic}, score ${i.score})`),
    '',
    '## Optional',
    `- [Sitemap](${base}/sitemap.xml)`,
    `- [Get listed (for builders)](${base}/join)`,
  ];
  return new Response(lines.join('\n') + '\n', { headers: { 'Content-Type': 'text/plain; charset=utf-8' } });
};
