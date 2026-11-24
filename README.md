# Courts Illustrated

Directory of verified court builders and companies, at courtsillustrated.com.

## How content works

Every builder and company is one small text file:

- `src/content/builders/<name>.md`: stats, certifications, verification checks, and their bio below the `---` line
- `src/content/companies/<name>.md`: service area (states and the first 3 digits of ZIP codes), website, services

A profile goes live only when its file says `published: true`. Keep it `false` until the numbers are real and verified.

The ranking formula lives in `src/lib/score.ts` (100 points: courts 40, years 25, certifications 20, content 15).

## Commands

Requires Node.js 18 or newer.

```
npm install      # once
npm run dev      # local preview at http://localhost:4321
npm run build    # builds the site into dist/
```

`mockup/` holds the original design mockups for reference. It isn't part of the site.
