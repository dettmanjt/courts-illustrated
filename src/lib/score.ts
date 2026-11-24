// Courts Illustrated score, out of 100.
export const WEIGHTS = { courts: 40, years: 25, certs: 20, content: 15 } as const;

type Stats = { courts: number; years: number; certs: string[]; articles: number; videos: number };

export function score(b: Stats) {
  const parts = {
    courts: Math.min(b.courts / 400, 1) * WEIGHTS.courts,           // full at 400+ courts
    years: Math.min(b.years / 25, 1) * WEIGHTS.years,                // full at 25+ years
    certs: Math.min(b.certs.length / 2, 1) * WEIGHTS.certs,          // 10 each, max 2
    content: Math.min((b.articles + b.videos / 4) / 15, 1) * WEIGHTS.content, // 4 videos = 1 article
  };
  const total = Math.round(parts.courts + parts.years + parts.certs + parts.content);
  return { total, parts };
}

export const initials = (n: string) => n.split(' ').map((w) => w[0]).join('');
