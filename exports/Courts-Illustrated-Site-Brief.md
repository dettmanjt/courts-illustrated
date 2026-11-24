# Courts Illustrated: Site Navigation and Workflow Brief

Prepared 2026-11-23 for comparing AI tools and website platforms. Five page mockups are attached as PDFs (see the end of this brief).

## 1. What Courts Illustrated is

Courts Illustrated (courtsillustrated.com, domain already owned) is an educational website about building sports courts. It also works as a **third-party directory that verifies court builders**: real people, at real companies, with real completed projects.

Goals:

1. **Teach buyers.** Answer the questions homeowners, HOAs, schools and facility owners actually ask about courts: cost, slabs, surfaces, fencing, lighting, timing.
2. **Verify builders.** Give each builder and company a public profile that confirms identity, employment, completed projects, certifications, license and insurance.
3. **Build trust signals for search and AI answers (AEO).** Each builder profile links to that builder's company website, and the company site links back. Every page carries schema.org structured data (Person, `worksFor` Organization, `sameAs` YouTube), so search engines and AI assistants can confirm who builds courts where.
4. **Generate leads** for the builders listed.

Ownership: Courts Illustrated belongs to the "Southwest group" of businesses (with Southwest Court Builders and Southwest Courts & Floors), which share customer data. Austin Courts & Floors is a separate company. The founder, JT Dettman, is a court builder at Austin Courts & Floors and is the first builder profile.

Look and feel: black background, large condensed headlines (Anton), clean sans-serif body text (Inter), thick white "court line" borders, accent colors from the CI logo (teal, pink, yellow, purple, navy).

## 2. Site map

```
/                                   Home: find a builder (search + rankings)
/builders/<builder-name>            Builder profile (one per person)
/companies/<company-name>           Company profile (one per company)
/articles/<article-slug>            Article (written by a builder)        [planned]
/articles                           All articles, filterable by topic      [planned]
/how-rankings-work                  Scoring and verification explained     [section on Home today]
```

## 3. Navigation

**Global header (every page):** CI logo (links Home) · Find a builder · How rankings work.

**Home: "Find a court builder"**
- Search box: ZIP code (matches on the first 3 digits) or state (code or full name).
- Toggle: **Builders** or **Companies**.
- Results: ranked list. Each builder row shows rank, headshot or initials, name, company, service area, tags (courts built, years, certifications, articles and videos, "Verification pending" when not yet verified) and a CI score with a color bar showing which categories earned the points.
- Company rows show the company score (average of its builders), number of builders and top services.
- Clicking a row opens that builder or company profile.
- "How rankings work" section explains the 100-point score.

**Builder profile** (sections in order)
1. Masthead: name, region, one-line role, stats (CI score, courts built, years, certifications, articles and videos).
2. About: bio in the builder's own voice, headshot, facts (company with link, service area, court types, surfaces).
3. Works at: company card with **View company profile** (internal link) and **Visit company website** (outbound backlink), plus a verification checklist: real person, employment, completed projects, license and insurance.
4. Videos: the builder's YouTube channel (JT's is mostly Shorts, so a vertical layout fits).
5. Written by [builder]: article cards tagged Cost, Comparison, Problems or How it works.
6. Questions I get asked: FAQ accordion with short answers.
7. Projects: photo gallery filterable by court type (pickleball, basketball, tennis, multi-sport).
8. Get in touch: contact form (name, email, ZIP, court type, message) that goes to the CRM tagged with the builder.

**Company profile**
1. Masthead: company name, region, description, stats (builders listed, courts built, years in business).
2. Company card: service area, service chips, outbound website link, company verification checklist.
3. Builders: grid of the company's builders, each linking to their profile.
4. Projects: gallery.

**Linking pattern (the backlink loop):** builder ↔ company profile on Courts Illustrated; builder and company profiles → company website; company website → its builders' Courts Illustrated profiles (to be added on each company's own site).

## 4. Content model

| Type | Key fields |
|---|---|
| Company | name, region, states served, ZIP prefixes served, website, description, services, verification status, published on/off |
| Builder | name, company, role, headshot, YouTube URL, courts built, years building, certifications, articles count, videos count, verification checks with date, bio, published on/off |
| Article | title, author (builder), topic tag, status (idea / draft / published), body, source questions |
| FAQ | question, answer, author, topic |
| Project | builder, company, court type, size, surface, city, photos, review status |
| Video | builder, YouTube URL, title (pulled from the channel automatically if possible) |

## 5. Ranking system (100 points)

| Category | Points | Full points at |
|---|---|---|
| Courts built | 40 | 400+ completed courts (backed by reviewed project photos) |
| Years building courts | 25 | 25+ years |
| Certifications | 20 | 10 each, up to 2 (e.g. ASBA Certified Tennis Court Builder, ASBA membership) |
| Content on Courts Illustrated | 15 | 15 articles; 4 videos count as 1 article |

Company score = average of its builders' scores. Rankings only count verified numbers; the mockup numbers are samples.

## 6. Workflows

**A. Content workflow (how articles and FAQs get made)**
1. JT records sales calls and site meetings with a Pocket recorder.
2. A Claude skill processes each recording: logs it to HubSpot, creates follow-up tasks, coaches JT, and adds buyer questions and expert answers to the **Content Knowledge Bank** (a shared doc with tabs: Buyer Questions, Fears & Objections, Expert Answers, Numbers & Pricing Signals, Stories & Proof).
3. Questions heard more than once become article ideas; expert answers become FAQ entries and article drafts in JT's voice.
4. JT reviews, then the article is published on Courts Illustrated under his profile, which raises his content score.
5. Short videos go to YouTube (@JTtheCourtBuilder) and appear on the profile.
6. Claims flagged "verify before publishing" (e.g. city tree rules, warranty terms) are checked before going live.

**B. Builder or company onboarding**
1. Builder or company applies (or is invited).
2. Courts Illustrated verifies identity, employment with the company, license and insurance, and reviews completed project photos. Each check is dated.
3. Builder submits stats (courts built, years, certifications), bio, headshot, YouTube link.
4. Profile is published only after verification. Unverified items show "Verification pending."
5. The company adds a link from its own site to its builders' Courts Illustrated profiles.

**C. Lead flow**
1. A visitor submits the contact form on a builder or company profile.
2. The form goes to HubSpot, tagged with Brand (Courts Illustrated) and Builder, with the page and article that brought them in.
3. The lead is routed to that builder's company, with a speed-to-lead follow-up task.

**D. Updating the site**
Must be easy both for humans (builders editing their own profile and posting articles in a simple editor) and for AI assistants (Claude skills or commands adding articles, updating stats and publishing) using as few credits and steps as possible.

## 7. Platform requirements

1. Low cost, scalable to many builders and companies, later franchise-style regions.
2. Multi-author: each builder can log in and edit only their own profile and articles.
3. Structured content (builders, companies, articles, projects) with templates, not hand-built pages.
4. ZIP/state search and the ranking calculation.
5. SEO and AEO: clean URLs, schema.org JSON-LD per page, fast pages, sitemap.
6. HubSpot forms and tracking (CI shares a HubSpot account with the Southwest group).
7. YouTube embeds (Shorts included).
8. AI-friendly editing: content an AI assistant can update reliably and cheaply.
9. Verification records with dates, and a published on/off switch per profile.

## 8. Options considered so far

| Option | Strengths | Concerns |
|---|---|---|
| **Astro static site + GitHub + Cloudflare Pages + a Git-based editor (Pages CMS or TinaCMS)** (current lean; a starter is already built) | Free hosting, very fast, content is plain text files that AI edits cheaply, full design control, version history | Needs initial developer-style setup; search runs in the browser; builder logins go through the editor |
| WordPress + HubSpot plugin | Mature, multi-author, huge plugin ecosystem, familiar | Maintenance and security updates; AI edits go through its API; harder to keep design exact |
| HubSpot Content Hub | Same system as the CRM; forms and attribution built in | Cost rises with seats and tiers; directory pages need higher tiers; less design flexibility |
| Webflow or Framer | Polished visual editing; CMS collections | Monthly cost; AI edits through their APIs; multi-author limits |
| GoHighLevel | Cheap all-in-one with site builder, booking, SMS | Built to keep sub-accounts separate; weaker fit for a content directory |

## 9. Open questions

1. Who verifies builders, how often, and what proof is required for each check?
2. Do builders pay to be listed, or is it free with leads as the value?
3. Should rankings show publicly at launch, or only after enough verified builders?
4. Which HubSpot account receives leads for builders at companies outside the Southwest group?
5. Are articles reviewed by Courts Illustrated before they publish?

## 10. Prompt to use with other AI platforms

> I'm building Courts Illustrated (courtsillustrated.com), an educational site about building sports courts that doubles as a directory verifying real court builders and companies. The attached brief describes the pages, navigation, content model, ranking system and workflows, and the PDFs show the mockups. Recommend the best platform and workflow to build and run it. Weigh cost, multi-author editing, ZIP and state search with rankings, SEO and AI-answer visibility through structured data, HubSpot integration, and how cheaply and reliably an AI assistant can update content. Compare at least three options, recommend one, and outline the build steps.

## Attached PDFs

1. `01-home.pdf`: Home, find a builder (search, rankings, how rankings work)
2. `02-builder-profile-jt-dettman.pdf`: full builder profile (JT Dettman)
3. `03-company-austin-courts-floors.pdf`: company profile
4. `04-company-nexcourt.pdf`: second company profile (NexCourt, DFW and Oklahoma)
5. `05-builder-template-chris-walker.pdf`: builder profile template before content is added

All stats, scores and project images in the mockups are samples or illustrations, not verified data.
