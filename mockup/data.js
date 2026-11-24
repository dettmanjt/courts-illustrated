// Directory data. On the real site each entry becomes its own content file.
window.CI = {
  companies: {
    "austin-courts-floors": {
      name: "Austin Courts & Floors",
      region: "Austin & Central Texas",
      states: ["TX"], zip3: ["765","766","767","768","786","787","789"],
      url: "https://austincourts.com",
      urlLabel: "austincourts.com",
      blurb: "Court builder serving Austin and Central Texas: pickleball, basketball, tennis and multi-sport courts, plus indoor sport flooring.",
      services: ["Pickleball", "Basketball", "Tennis", "Multi-sport", "Indoor sport flooring", "Resurfacing"],
      builders: ["jt-dettman", "brent-murphy", "jason-winkler"],
      projects: [
        { t: "Backyard pickleball, West Austin", d: "30×60 · post-tension slab", court: "pickleball", c: "#2f6fb3,#1d4f86" },
        { t: "HOA tennis rebuild", d: "Post-tension cap · light bars", court: "tennis", c: "#3a7a58,#2f5e8c" },
        { t: "Camp multi-sport court", d: "Modular tile", court: "multi", c: "#3d7d4f,#2a5c39" }
      ]
    },
    "nexcourt": {
      name: "NexCourt",
      region: "Dallas–Fort Worth, North Texas & Oklahoma",
      states: ["TX","OK"], zip3: ["750","751","752","753","754","760","761","762","763","730","731","734","740","741"],
      url: "https://nexcourt.com",
      urlLabel: "nexcourt.com",
      blurb: "Residential and commercial court builder using modular tile surfacing, with 30+ years and thousands of courts installed across North Texas and Oklahoma.",
      services: ["Pickleball", "Basketball", "Tennis", "Multi-sport", "Commercial & public courts", "Indoor gym flooring"],
      builders: ["chris-walker", "jeff-wolf", "mark-kondisak"],
      projects: [
        { t: "Backyard basketball, Frisco", d: "Example project", court: "half", c: "#5a5f66,#b5462f" },
        { t: "Two-court pickleball, Fort Worth", d: "Example project", court: "double", c: "#c27a2c,#2f6fb3" },
        { t: "Club tennis resurface, Plano", d: "Example project", court: "tennis", c: "#2f5e8c,#3a7a58" }
      ]
    }
  },
  builders: {
    "jt-dettman":     { name: "JT Dettman",     company: "austin-courts-floors", page: "jt-dettman.html", verified: true, courts: 120, years: 8, certs: ["ASBA member"], articles: 9, videos: 40, photo: "jt-headshot.png", youtube: "https://www.youtube.com/@JTtheCourtBuilder" },
    "brent-murphy":   { name: "Brent Murphy",   company: "austin-courts-floors", courts: 200, years: 15, certs: ["ASBA CTCB"], articles: 0, videos: 0 },
    "jason-winkler":  { name: "Jason Winkler",  company: "austin-courts-floors", courts: 90, years: 6, certs: [], articles: 2, videos: 5 },
    "chris-walker":   { name: "Chris Walker",   company: "nexcourt", courts: 400, years: 25, certs: ["ASBA member"], articles: 0, videos: 0 },
    "jeff-wolf":      { name: "Jeff Wolf",      company: "nexcourt", courts: 250, years: 18, certs: ["ASBA CTCB","USTA facility"], articles: 1, videos: 0 },
    "mark-kondisak":  { name: "Mark Kondisak",  company: "nexcourt", courts: 150, years: 12, certs: [], articles: 0, videos: 3 }
  }
};
CI.builderHref = id => CI.builders[id].page || ("builder.html#" + id);
CI.initials = n => n.split(" ").map(w => w[0]).join("");
// Ranking: 100-point Courts Illustrated score. Sample numbers until builders submit real ones.
CI.WEIGHTS = { courts: 40, years: 25, certs: 20, content: 15 };
CI.score = b => {
  const parts = {
    courts: Math.min(b.courts / 400, 1) * CI.WEIGHTS.courts,   // full marks at 400+ courts
    years:  Math.min(b.years / 25, 1) * CI.WEIGHTS.years,      // full marks at 25+ years
    certs:  Math.min(b.certs.length / 2, 1) * CI.WEIGHTS.certs, // full marks at 2+ certifications
    content: Math.min((b.articles + b.videos / 4) / 15, 1) * CI.WEIGHTS.content // 4 videos count as 1 article; full at 15
  };
  const total = Math.round(Object.values(parts).reduce((a, c) => a + c, 0));
  return { total, parts };
};
CI.companyScore = id => {
  const bs = CI.companies[id].builders.map(b => CI.score(CI.builders[b]).total);
  return Math.round(bs.reduce((a, c) => a + c, 0) / bs.length);
};
