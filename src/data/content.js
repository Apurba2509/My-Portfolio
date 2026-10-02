// Everything the site says lives in this file.
// To update the portfolio, edit the data below; the components read from here.

export const site = {
  name: "Apurba Das",
  first: "Apurba",
  last: "Das",
  handle: "Apurba2509",
  role: "Full-stack & mobile developer",
  // What search engines and AI answer engines show. Keep the title under ~60 characters
  // and the description under ~155.
  title: "Apurba Das — Full-Stack & Mobile Developer in Kolkata",
  description:
    "Apurba Das is a full-stack and mobile developer from Kolkata building React, React Native, Flutter and cloud apps. BCA student at Techno Main Salt Lake.",
  url: "https://apurba2509-portfolio.vercel.app",
  email: "apurbadas2509@gmail.com",
  city: "Kolkata",
  region: "West Bengal",
  country: "IN",
  school: "Techno Main Salt Lake",
  // When this portfolio first went up (the repo's first commit). Used as the profile page's
  // dateCreated in structured data; it needs a full date and time.
  launched: "2025-07-20T20:12:44+05:30",
  location: "Kolkata, IN",
  // Paste the codes from Google Search Console and Bing Webmaster Tools (HTML tag method):
  // only the content="…" value, e.g. googleVerification: "abc123". See SEO.md.
  googleVerification: "N3tASIoiPc__D1eW40INrefJQi-m5dIB5wzixnzrxyc",
  bingVerification: "",
  coords: "22.57°N 88.36°E",
  timeZone: "Asia/Kolkata",
  // Shown in the "Now" block and the footer, so visitors know the site is current.
  updated: "Sep 2026",
  available: "Open to opportunities",
};

// `index` is the section number: the page counts from 0 to 1 as you scroll.
export const nav = [
  { label: "Work", href: "#work", index: "0.4" },
  { label: "Journey", href: "#journey", index: "0.6" },
  { label: "Stack", href: "#stack", index: "0.8" },
  { label: "Contact", href: "#contact", index: "1.0" },
];

export const socials = [
  { label: "LinkedIn", handle: "in/apurbadas2509", href: "https://www.linkedin.com/in/apurbadas2509/" },
  { label: "GitHub", handle: "@Apurba2509", href: "https://github.com/Apurba2509" },
  { label: "Instagram", handle: "@___apurbax___", href: "https://www.instagram.com/___apurbax___/" },
];

// More public profiles of the same person. Search engines get these (sameAs, rel="me"); the page doesn't show them.
export const otherProfiles = ["https://me.developers.google.com/u/Apurba2509"];

export const hero = {
  meta: [
    { k: "Role", v: "Full-stack & mobile developer" },
    { k: "Study", v: "BCA ’28 — Techno Main Salt Lake" },
    { k: "Based", v: "Kolkata, IN — 22.57°N 88.36°E" },
  ],
  caption: "Fig. 01 — that’s me",
};

export const about = {
  // Words wrapped in *asterisks* get the yellow highlight as you scroll past them.
  manifesto:
    "I’m a developer and BCA student at Techno Main Salt Lake, working in the space between *engaging UI* and *robust backend architecture.* I love taking projects from zero to one — architecting a *mobile app,* configuring *AWS and GCP,* or organizing *large-scale tech events.*",
  now: [
    { k: "Facilitating", v: "Google Cloud Arcade — 2026 cohort" },
    { k: "Contributing", v: "GSSoC ’26 & Apertre 3.0" },
    { k: "Leading", v: "Social media & PR at GDG On-Campus TMSL" },
  ],
};

export const tapes = {
  one: ["Open to opportunities", "Internships", "Hackathons", "Open source", "Collabs"],
  two: ["From zero to one", "Shipped against the clock", "Built in Kolkata", "Web · Mobile · Cloud"],
};

// `poster` picks the artwork drawn for each card (see src/components/posters).
// `tone` sets the card colour: "ink", "bone" or "taxi".
export const projects = [
  {
    id: "cosmic-scroll",
    title: "Cosmic Scroll",
    year: "2026",
    kind: "Creative dev — Web",
    tagline: "A voyage through space, driven by your scroll wheel.",
    description:
      "A brutalist, scroll-pinned journey through the universe. GSAP scrub timelines drive real-time GLSL shaders — solar flares, black holes — rendered with React Three Fiber on a stark 1px grid.",
    stack: ["React 19", "GSAP", "Three.js", "R3F", "GLSL", "Tailwind v4"],
    links: [
      { label: "Live site", href: "https://scroll-theta-pied.vercel.app" },
      { label: "Source", href: "https://github.com/Apurba2509/Scroll" },
    ],
    poster: "cosmic",
    tone: "ink",
  },
  {
    id: "ritual",
    title: "Ritual",
    year: "2026",
    kind: "Mobile — iOS & Android",
    tagline: "A habit tracker that keeps working when the internet doesn’t.",
    description:
      "Offline-first, with zero-latency MMKV storage and silent Supabase sync in the background. Skia-drawn heatmaps, 120fps Reanimated springs, and social challenges with real-time leaderboards.",
    stack: ["React Native", "Expo", "TypeScript", "Reanimated", "Skia", "Supabase"],
    links: [{ label: "Source", href: "https://github.com/Apurba2509/Ritual" }],
    poster: "ritual",
    tone: "bone",
  },
  {
    id: "crypto-tip-jar",
    title: "Crypto Tip Jar",
    year: "2026",
    kind: "Web3 — Hackathon",
    tagline: "No backend. No middlemen. Just a contract.",
    description:
      "A Stellar dApp where every XLM tip lives on-chain in a Rust Soroban contract. Connect Freighter, tip in one click, watch the live feed update — the React front end talks to the chain directly.",
    stack: ["Rust", "Soroban", "Stellar SDK", "React", "Vite"],
    links: [
      { label: "Live site", href: "https://crypto-tip-jar-five.vercel.app" },
      { label: "Source", href: "https://github.com/Apurba2509/Crypto-Tip-Jar" },
    ],
    poster: "tipjar",
    tone: "taxi",
  },
  {
    id: "navigo",
    title: "NaviGO",
    year: "2025",
    kind: "Mobile — Maps",
    tagline: "Routing built on Kolkata’s real road network.",
    description:
      "An Expo app with Firebase sign-in and live location, backed by a Flask engine that loads the city’s drive network with OSMnx and computes routes over it with NetworkX.",
    stack: ["React Native", "Expo", "Firebase", "Python", "Flask", "OSMnx"],
    links: [
      { label: "App source", href: "https://github.com/Apurba2509/NaviGO" },
      { label: "Engine source", href: "https://github.com/Apurba2509/NaviGO-backend" },
    ],
    poster: "navigo",
    tone: "ink",
  },
  {
    id: "orbit-ai",
    title: "Orbit AI",
    year: "2025",
    kind: "Android — AI",
    tagline: "A Gemini chatbot with a nebula that breathes.",
    description:
      "Native Android in Jetpack Compose. Switch between Gemini Flash for speed and Pro for reasoning, send photos straight from the camera, and read answers through a custom markdown renderer.",
    stack: ["Kotlin", "Jetpack Compose", "Material 3", "Gemini API"],
    links: [{ label: "Source", href: "https://github.com/Apurba2509/Orbit-AI" }],
    poster: "orbit",
    tone: "bone",
  },
  {
    id: "gestureflow",
    title: "GestureFlow 3D",
    year: "2025",
    kind: "Creative dev — Computer vision",
    tagline: "Wave your hand, move the galaxy.",
    description:
      "A real-time 3D particle system steered by hand gestures. MediaPipe tracks 21 hand landmarks through the webcam; Three.js and React Three Fiber turn them into motion.",
    stack: ["React 19", "Three.js", "R3F", "MediaPipe", "TypeScript"],
    links: [{ label: "Source", href: "https://github.com/Apurba2509/GestureFlow-3D" }],
    poster: "gesture",
    tone: "ink",
  },
];

export const moreWork = [
  {
    title: "GeoGuide AI",
    year: "2025",
    note: "Map-based Gemini chatbot grounded in Search & Maps data",
    stack: "React · TypeScript · Leaflet",
    href: "https://github.com/Apurba2509/GeoGuide-AI",
  },
  {
    title: "Weather Snap",
    year: "2025",
    note: "Real-time weather for any city on Earth",
    stack: "React · Tailwind · OpenWeather",
    href: "https://weather-snap-one.vercel.app",
  },
  {
    title: "EduSync",
    year: "2025",
    note: "Quizzes, attendance, assignments and study uploads for classrooms",
    stack: "Node · Express · MongoDB",
    href: "https://github.com/Apurba2509/EduSync",
  },
];

// `when` is optional; leave it out when there is no date to show.
export const journey = [
  {
    type: "Hackathon",
    title: "Google Solution Challenge",
    when: "2026",
    detail: "Prototyped DisasterOps for the global round.",
  },
  {
    type: "Hackathon",
    title: "Smart India Hackathon",
    detail: "Competed and presented our team’s prototypes.",
  },
  {
    type: "Hackathon",
    title: "HackForge",
    when: "Srijan ’26",
    detail: "Built against the clock at Srijan ’26.",
  },
  {
    type: "Organizer",
    title: "TechSprint",
    detail: "Co-organized GDG On-Campus TMSL’s inaugural hackathon.",
  },
  {
    type: "Community",
    title: "GDG On-Campus TMSL",
    detail: "Social Media Head & PR Core.",
  },
  {
    type: "Community",
    title: "Google Cloud Arcade",
    when: "2026 cohort",
    detail: "Co-Facilitator, guiding learners through Google Cloud.",
  },
  {
    type: "Community",
    title: "QZone",
    detail: "Joint Head.",
  },
  {
    type: "Open source",
    title: "GSSoC ’26 & Apertre 3.0",
    when: "2026",
    detail: "Mentee and selected contributor.",
  },
  {
    type: "Open source",
    title: "MapifyOS",
    when: "OSCG ’26",
    detail: "Pull requests for Open Source Connect Global.",
  },
  {
    type: "Work",
    title: "Fusion Weavers Inc.",
    when: "2025 —",
    detail: "Frontend developer, remote. Building React applications.",
  },
  {
    type: "Education",
    title: "Techno Main Salt Lake",
    when: "2024 — 2028",
    detail: "Bachelor of Computer Applications. CGPA 8.8 / 10.",
  },
];

export const stack = [
  {
    label: "Build",
    items: ["React", "React Native", "Flutter", "Jetpack Compose", "TypeScript", "JavaScript", "Tailwind", "HTML & CSS"],
  },
  {
    label: "Ship",
    items: ["Node.js", "Express", "Firebase", "Supabase", "MongoDB", "MySQL", "AWS", "Google Cloud", "PHP"],
  },
  {
    label: "Tinker",
    items: ["Kotlin", "Python", "Rust", "C", "Three.js", "GSAP", "Gemini API", "Git", "Android Studio"],
  },
];

// Shown as "Quick answers" near the end of the page and published as FAQ structured data,
// so search and AI answer engines can quote it directly. Keep answers short and factual.
export const faq = [
  {
    q: "Who is Apurba Das?",
    a: "Apurba Das is a full-stack and mobile developer from Kolkata, India, studying for a BCA at Techno Main Salt Lake (2024–2028). Apurba builds web apps, Android and cross-platform mobile apps, and cloud-backed products, and is active in GDG On-Campus TMSL, Google Cloud Arcade and open-source programmes such as GSSoC ’26.",
  },
  {
    q: "What technologies does Apurba Das work with?",
    a: "Front end and mobile: React, React Native, Flutter, Jetpack Compose, TypeScript and Tailwind CSS. Back end and cloud: Node.js, Express, Firebase, Supabase, MongoDB, MySQL, AWS and Google Cloud. Also Kotlin, Python, Rust, Three.js, GSAP and the Gemini API.",
  },
  {
    q: "What projects has Apurba Das built?",
    a: "Highlights include Cosmic Scroll, a scroll-driven WebGL experience; Ritual, an offline-first habit tracker in React Native; Crypto Tip Jar, a Stellar Soroban dApp; NaviGO, routing on Kolkata’s road network; Orbit AI, a Gemini chatbot for Android; and GestureFlow 3D, hand-gesture particles built with MediaPipe.",
  },
  {
    q: "Which hackathons and tech communities is Apurba Das part of?",
    a: "Apurba prototyped DisasterOps for the Google Solution Challenge 2026, competed in Smart India Hackathon and HackForge at Srijan ’26, and co-organized TechSprint, GDG On-Campus TMSL’s first hackathon. Apurba is Social Media Head & PR Core at GDG On-Campus TMSL, Joint Head of QZone and a Google Cloud Arcade co-facilitator.",
  },
  {
    q: "Is Apurba Das open to internships and collaborations?",
    a: "Yes. Apurba is open to internships, collaborations, hackathon teams and open-source work across web, mobile and cloud. The quickest way to get in touch is email (apurbadas2509@gmail.com) or LinkedIn.",
  },
  {
    q: "How can I contact Apurba Das?",
    a: "Email apurbadas2509@gmail.com, message Apurba on LinkedIn at linkedin.com/in/apurbadas2509, or use the contact form on this site. Code and projects are on GitHub at github.com/Apurba2509.",
  },
];

// EmailJS keys are public by design (they only allow sending through this template).
export const emailjs = {
  serviceId: "service_7x5i9x6",
  templateId: "template_qchyt8b",
  publicKey: "WnLgZwFr8b4NFjhhh",
};
