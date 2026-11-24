// Directory data. On the real site each entry becomes its own content file.
window.CI = {
  companies: {
    "austin-courts-floors": {
      name: "Austin Courts & Floors", region: "Austin & Central Texas",
      states: ["TX"], zip3: ["765","766","767","768","786","787","789"],
      url: "https://austincourts.com", urlLabel: "austincourts.com",
      blurb: "Court builder serving Austin and Central Texas: pickleball, basketball, tennis and multi-sport courts, plus indoor sport flooring.",
      services: ["Pickleball", "Basketball", "Tennis", "Multi-sport", "Indoor sport flooring", "Resurfacing"],
      builders: ["jt-dettman", "brent-murphy", "jason-winkler"],
      projects: [
        { t: "Shaded pickleball courts", d: "Pickleball", img: "projects/austin-courts-floors/2940293283.jpg" },
        { t: "Tennis and pickleball court", d: "Tennis", img: "projects/austin-courts-floors/2970199726.jpg" },
        { t: "Backyard multi-sport court", d: "Multi-sport", img: "projects/austin-courts-floors/3050430999.jpg" },
        { t: "Hillside half-court", d: "Basketball", img: "projects/austin-courts-floors/3237585755.jpg" },
        { t: "Poolside multi-sport court", d: "Multi-sport", img: "projects/austin-courts-floors/3258404516.jpg" },
        { t: "Backyard basketball court", d: "Basketball", img: "projects/austin-courts-floors/3291285488.jpg" },
        { t: "Basketball court with turf border", d: "Basketball", img: "projects/austin-courts-floors/3295918028.jpg" },
        { t: "Pickleball and basketball combo", d: "Pickleball", img: "projects/austin-courts-floors/3307361637.jpg" },
        { t: "Hill Country multi-sport court", d: "Multi-sport", img: "projects/austin-courts-floors/3326423340.jpg" },
        { t: "Lake-view multi-sport court", d: "Multi-sport", img: "projects/austin-courts-floors/3423901636.jpg" },
        { t: "Lakeside basketball court", d: "Basketball", img: "projects/austin-courts-floors/3476084313.jpg" },
        { t: "Green tennis and pickleball court", d: "Tennis", img: "projects/austin-courts-floors/3573396365.jpg" },
        { t: "Blue full basketball court", d: "Basketball", img: "projects/austin-courts-floors/3671654350.jpg" }
      ]
    },
    "nexcourt": {
      name: "NexCourt", region: "Dallas–Fort Worth, North Texas & Oklahoma",
      states: ["TX","OK"], zip3: ["750","751","752","753","754","760","761","762","763","730","731","734","740","741"],
      url: "https://nexcourt.com", urlLabel: "nexcourt.com",
      blurb: "Residential and commercial court builder using modular tile surfacing, founded in 1988, with thousands of courts installed across North Texas and Oklahoma.",
      services: ["Pickleball", "Basketball", "Tennis", "Multi-sport", "Commercial & public courts", "Indoor gym flooring"],
      builders: ["mark-kundysek", "kristy-kundysek", "chris-walker", "jeremy-butler", "jeff-wolf", "robin-allen", "richard-blanchard"],
      projects: []
    },
    "lone-star-game-courts": {
      name: "Lone Star Game Courts", region: "San Antonio & South Texas",
      states: ["TX"], zip3: ["780","781","782","783","784","785","788"],
      url: "https://lonestargamecourts.com", urlLabel: "lonestargamecourts.com",
      blurb: "San Antonio game court contractor building backyard courts, school gyms and church recreation spaces across South Texas.",
      services: ["Basketball", "Pickleball", "Volleyball", "Multi-sport", "Indoor gym flooring", "Fencing & lighting"],
      builders: ["eric-meyer"], projects: []
    },
    "sportscape-builders": {
      name: "SportScape Builders", region: "Ohio, West Virginia & Florida",
      states: ["OH","WV","FL"], zip3: [...Array.from({length:29},(_,i)=>String(430+i)), ...Array.from({length:22},(_,i)=>String(247+i))],
      url: "https://www.sportscapebuilders.com", urlLabel: "sportscapebuilders.com",
      blurb: "Marysville, Ohio court and gym builder since 1990, with more than 5,000 completed projects and a certified Sport Court distributor.",
      services: ["Backyard courts", "Home gymnasiums", "Golf greens", "Basketball hoops", "Fitness equipment"],
      builders: ["jeff-chambers"], projects: []
    },
    "cba-sports": {
      name: "CBA Sports", region: "Atlanta & the Southeast",
      states: ["GA"], zip3: Array.from({length:20},(_,i)=>String(300+i)),
      url: "https://www.cbasports.com", urlLabel: "cbasports.com",
      blurb: "Norcross, Georgia sports construction specialist since 1992, building gym floors, courts, tracks and turf for clients including UGA, Georgia Tech, Clemson and the Atlanta Hawks.",
      services: ["Indoor gym flooring", "Basketball", "Pickleball", "Tennis", "Running tracks", "Synthetic turf"],
      builders: [], projects: []
    },
    "court-builders-stl": {
      name: "Court Builders of St. Louis", region: "St. Louis, Missouri & Illinois",
      states: ["MO","IL"], zip3: ["630","631","632","633","620","622"],
      url: "https://www.courtbuilders-stl.com", urlLabel: "courtbuilders-stl.com",
      blurb: "Family-owned St. Louis court builder founded by Austin and Dionna Helfers, with 700+ courts built across Missouri and Illinois.",
      services: ["Basketball", "Pickleball", "Tennis", "Putting greens", "Home gyms", "Batting cages"],
      builders: ["austin-helfers", "dionna-helfers"], projects: []
    },
    "legendary-sports-construction": {
      name: "Legendary Sports Construction", region: "Las Vegas, Southern Nevada & Arizona",
      states: ["NV","AZ"], zip3: ["889","890","891","850","851","852","853","854","855","856","857","858","859","860","861","862","863","864","865"],
      url: "https://legendarysportsconstruction.com", urlLabel: "legendarysportsconstruction.com",
      blurb: "Las Vegas court builder with 20+ years of experience, building residential and commercial courts for homeowners, schools, HOAs and communities across Southern Nevada and Arizona.",
      services: ["Pickleball", "Basketball", "Tennis", "Volleyball", "Hockey", "Multi-sport", "Maintenance"],
      builders: ["miles-reynolds"], projects: []
    }
  },
  builders: {
    "jt-dettman":        { name: "JT Dettman", role: "Director of Sales and Marketing", company: "austin-courts-floors", page: "jt-dettman.html", verified: true, courts: 120, years: 8, certs: ["ASBA member"], articles: 9, videos: 40, photo: "jt-headshot.png", youtube: "https://www.youtube.com/@JTtheCourtBuilder" },
    "brent-murphy":      { name: "Brent Murphy", role: "Court Advisor", company: "austin-courts-floors", courts: 200, years: 15, certs: ["ASBA CTCB"], articles: 0, videos: 0, photo: "brent-murphy.png",
      bio: "Everyone at Austin Courts looks out for each other. Nobody has an ego. We are all on the same team. Being in sports and coaching my whole life, this has been a smooth transition and a welcomed one. The company has a great story and proven success rate because they truly care about the customers and getting kids and families outside playing together." },
    "jason-winkler":     { name: "Jason Winkler", role: "Senior Court Advisor", company: "austin-courts-floors", courts: 90, years: 6, certs: [], articles: 2, videos: 5, photo: "jason-winkler.png",
      bio: "Family. Everything is centered around family. I know anyone in this company would do anything for me and my family, and I hope they know the same of me for theirs. That thought process bleeds over into how we treat our customers. We provide a family service. We want families to play together and make memories together." },
    "mark-kundysek":     { name: "Mark Kundysek", role: "Founder, President & Co-Owner", company: "nexcourt", courts: 150, years: 37, certs: [], articles: 0, videos: 3, photo: "mark-kundysek.webp",
      bio: "I was working for a plastics company in Grand Prairie in 1988 when I first saw a sample of modular tile surfacing for athletic courts. That curiosity led me to buy a $250 dealer kit and launch NexCourt. I'm a Texas Tech graduate and live in Arlington with my wife Kristy and our two sons." },
    "kristy-kundysek":   { name: "Kristy Kundysek", role: "Co-Owner", company: "nexcourt", courts: 0, years: 0, certs: [], articles: 0, videos: 0, photo: "kristy-kundysek.png",
      bio: "I have a passion for sports and fitness. I hold a BS in Kinesiology and Exercise Science from Texas Tech University and enjoy my role at NexCourt encouraging athletic play and good health." },
    "chris-walker":      { name: "Chris Walker", role: "Sales Manager", company: "nexcourt", courts: 400, years: 25, certs: ["ASBA member"], articles: 0, videos: 0, photo: "chris-walker.png",
      bio: "I've had a 25-year career with NexCourt and serve as sales manager, on projects ranging from one-of-a-kind courts for famous athletes to small shooting courts for families across North Texas and Oklahoma." },
    "jeremy-butler":     { name: "Jeremy Butler", role: "Outside Sales, Tarrant County", company: "nexcourt", courts: 0, years: 10, certs: [], articles: 0, videos: 0, photo: "jeremy-butler.png",
      bio: "I've been with NexCourt since 2015. Before that I designed and sold custom pools and outdoor living spaces. I'm a Plano native and a Texas Tech graduate." },
    "jeff-wolf":         { name: "Jeff Wolf", role: "Operations Manager, Commercial Sales & Sports Construction Consultant", company: "nexcourt", courts: 250, years: 18, certs: ["ASBA CTCB","USTA facility"], articles: 1, videos: 0, photo: "jeff-wolf.png" },
    "robin-allen":       { name: "Robin Allen", role: "Sports & Athletic Flooring Consultant", company: "nexcourt", courts: 0, years: 0, certs: [], articles: 0, videos: 0, photo: "robin-allen.png" },
    "richard-blanchard": { name: "Richard Blanchard", role: "Certified Court Builder", company: "nexcourt", courts: 0, years: 0, certs: [], articles: 0, videos: 0 },
    "eric-meyer":        { name: "Eric Meyer", role: "Owner", company: "lone-star-game-courts", courts: 0, years: 0, certs: [], articles: 0, videos: 0, photo: "eric-meyer.png",
      bio: "I lead Lone Star Game Courts out of San Antonio. My background includes architectural drawing and CAD, and my crew builds everything from backyard game courts to school gyms and church recreation spaces." },
    "jeff-chambers":     { name: "Jeff Chambers", role: "Founder & CEO", company: "sportscape-builders", courts: 0, years: 25, certs: [], articles: 0, videos: 0, photo: "jeff-chambers.png",
      bio: "I've been building courts and gyms for over 25 years. I founded SportScape Builders in Marysville, Ohio, where our team designs and installs backyard courts, home gymnasiums and sports centers." },
    "austin-helfers":    { name: "Austin Helfers", role: "Co-Founder", company: "court-builders-stl", courts: 0, years: 0, certs: [], articles: 0, videos: 0 },
    "dionna-helfers":    { name: "Dionna Helfers", role: "Co-Founder", company: "court-builders-stl", courts: 0, years: 0, certs: [], articles: 0, videos: 0 },
    "miles-reynolds":    { name: "Miles Reynolds", role: "Court builder", company: "legendary-sports-construction", courts: 0, years: 0, certs: [], articles: 0, videos: 0,
      bio: "I grew up playing sports with my three brothers and friends almost every day on the court in our driveway. I love seeing a family's home become the hangout house in the neighborhood." }
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
  return bs.length ? Math.round(bs.reduce((a, c) => a + c, 0) / bs.length) : 0;
};
