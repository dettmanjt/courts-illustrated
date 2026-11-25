import { defineCollection, reference, z } from 'astro:content';

// One file per company in src/content/companies/
const companies = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    region: z.string(),
    states: z.array(z.string()),          // e.g. ["TX", "OK"]
    zip3: z.array(z.string()),            // first 3 digits of ZIP codes served
    website: z.string().url().optional(),
    blurb: z.string(),
    services: z.array(z.string()),
    photos: z.array(z.object({ src: z.string(), title: z.string(), type: z.string() })).default([]),
    published: z.boolean().default(false),
  }),
});

// One file per builder in src/content/builders/
const builders = defineCollection({
  type: 'content',
  schema: z.object({
    name: z.string(),
    company: reference('companies'),
    role: z.string().default('Court builder'),
    photo: z.string().optional(),          // path under /public
    youtube: z.string().url().optional(),
    videoIds: z.array(z.string()).default([]), // YouTube video IDs to feature
    // Hand-picked customer reviews that name this builder. Copy the wording exactly and keep the source link.
    reviews: z.array(z.object({
      quote: z.string(),
      author: z.string(),            // as shown on the source, e.g. "Sarah M."
      location: z.string().optional(), // e.g. "Westlake, TX"
      source: z.string(),            // e.g. "Google", "Facebook", "Houzz"
      url: z.string().url().optional(),
      date: z.string().optional(),   // e.g. "2025-06"
      project: z.string().optional(), // e.g. "Backyard pickleball court"
    })).default([]),
    courts: z.number().int().nonnegative(),
    years: z.number().int().nonnegative(),
    certs: z.array(z.string()).default([]),
    articles: z.number().int().nonnegative().default(0),
    videos: z.number().int().nonnegative().default(0),
    verified: z.object({
      identity: z.boolean().default(false),
      employment: z.boolean().default(false),
      projects: z.boolean().default(false),
      license: z.boolean().default(false),
      checkedOn: z.string().optional(),    // YYYY-MM-DD
    }).default({}),
    published: z.boolean().default(false), // only verified, real data goes live
  }),
});

export const collections = { companies, builders };
