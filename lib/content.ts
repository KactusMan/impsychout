// All page copy lives here so it can be reviewed in one place.
// House style: plain, warm language. No em dashes.

export const site = {
  name: "ImPsychOut",
  url: process.env.NEXT_PUBLIC_SITE_URL ?? "https://impsychout.vercel.app",
  instagram: "https://www.instagram.com/impsychout/",
  therapist: "Laraib Fatima Ahmed",
  title: "Online Therapy with Clinical Psychologist Laraib Fatima Ahmed",
  description:
    "Online therapy for teens, young adults and adults with clinical psychologist Laraib Fatima Ahmed. Warm, evidence-based support for anxiety, low mood, OCD, neurodiversity and more. Request a free 15-minute consultation.",
};

export const nav = [
  { href: "#about", label: "About" },
  { href: "#focus", label: "How I help" },
  { href: "#approach", label: "Approach" },
  { href: "#process", label: "How it works" },
  { href: "#faq", label: "FAQ" },
];

export const ribbonWords = [
  "Evidence-based",
  "Emotion regulation",
  "Trauma-informed",
  "Safe & seen",
  "Neurodiversity-affirming",
  "At your own pace",
];

export type Tone = "sky" | "blue" | "pink" | "paper" | "butter";
export type DoodleName =
  | "star" | "sparkle" | "heart" | "flower" | "cat" | "arrow" | "squiggle"
  | "plane" | "cloud" | "butterfly" | "loop" | "sun";

export const focusAreas: { title: string; body: string; tone: Tone; icon: DoodleName }[] = [
  {
    title: "Anxiety & panic",
    body: "Understanding fight-or-flight triggers, calming rumination loops, and helping your nervous system feel safe again.",
    tone: "sky",
    icon: "sun",
  },
  {
    title: "Depression & low mood",
    body: "Compassionate support through numbness, fatigue and self-criticism, and a gentle reconnection with what makes you feel alive.",
    tone: "blue",
    icon: "cloud",
  },
  {
    title: "OCD & intrusive thoughts",
    body: "Evidence-informed tools, including ERP foundations, to ease fear spirals without giving in to compulsions.",
    tone: "pink",
    icon: "loop",
  },
  {
    title: "Neurodiversity & autism",
    body: "Affirming support for autistic and ADHD people: unmasking safely, sensory profiling and executive-function scaffolding.",
    tone: "paper",
    icon: "butterfly",
  },
  {
    title: "Personality disorders",
    body: "DBT-informed skills for emotional resilience, distress tolerance, relationships and self-acceptance.",
    tone: "butter",
    icon: "heart",
  },
  {
    title: "Schizophrenia-spectrum",
    body: "Grounded psychoeducation, stabilising routines, family guidance and compassionate long-term care.",
    tone: "sky",
    icon: "flower",
  },
  {
    title: "Individual therapy",
    body: "A gentle, confidential one-to-one space to untangle complex emotions, navigate life transitions and understand yourself.",
    tone: "paper",
    icon: "plane",
  },
  {
    title: "Psychological assessment",
    body: "Structured evaluations and psychometric profiling that guide focused, personalised next steps.",
    tone: "blue",
    icon: "star",
  },
];

export const approaches = [
  {
    id: "cbt",
    tab: "CBT",
    name: "Cognitive Behavioural Therapy",
    title: "Your thoughts shape your feelings.",
    body: "Notice how your thoughts mould your feelings and physical reactions. Together, we gently test and reshape rigid automatic patterns.",
    note: "“what's the evidence for that thought?”",
    color: "var(--navy)",
  },
  {
    id: "dbt",
    tab: "DBT",
    name: "Dialectical Behaviour Therapy",
    title: "Ride the wave, don't drown in it.",
    body: "Practical skills for intense emotions, for sitting with deep distress without panic, and for building grounded relationships.",
    note: "“both things can be true.”",
    color: "var(--denim)",
  },
  {
    id: "act",
    tab: "ACT",
    name: "Acceptance & Commitment Therapy",
    title: "Stop wrestling with your feelings.",
    body: "Make room for what's present, then take clear action toward what you genuinely value.",
    note: "“make space, then move.”",
    color: "var(--cornflower)",
  },
  {
    id: "rebt",
    tab: "REBT",
    name: "Rational Emotive Behaviour Therapy",
    title: "Drop the hidden “musts”.",
    body: "Uncover the unspoken rules and self-limiting expectations driving your mood, and build steady, unconditional self-worth.",
    note: "“says who?”",
    color: "var(--pink-deep)",
  },
  {
    id: "pbm",
    tab: "PBM",
    name: "Positive Behaviour Management",
    title: "Spaces where minds can thrive.",
    body: "Strengths-based approaches that ease sensory-overload triggers and shape environments where neurodivergent minds flourish.",
    note: "“change the room, not the person.”",
    color: "var(--sage-deep)",
  },
  {
    id: "eidetic",
    tab: "Eidetic",
    name: "Eidetic Therapy",
    title: "When words aren't enough.",
    body: "Work with inner imagery and sensory memory to gently loosen emotional knots that talking alone can't reach.",
    note: "“what do you see?”",
    color: "var(--butter-deep)",
  },
];

export const steps = [
  {
    title: "Request a consultation",
    body: "Fill in the short, private form. I read every request myself before replying.",
  },
  {
    title: "A free 15-minute fit check",
    body: "A quick video or audio call to answer your questions and see if we're a good match. No pressure.",
  },
  {
    title: "Intake conversation",
    body: "A gentle 50-minute first session about where you are, what's hard and your pace. You never have to share everything at once.",
  },
  {
    title: "Ongoing growth",
    body: "Weekly or fortnightly sessions with a clear, flexible plan, so you can practise skills and build lasting self-trust.",
  },
];

export const credentials = [
  {
    heading: "Education & societies",
    icon: "star" as DoodleName,
    items: [
      { title: "MSc Clinical Psychology", detail: "Graduated with Merit, Distinction in empirical dissertation" },
      { title: "BS (Hons) Psychology", detail: "Air University, Magna Cum Laude" },
      { title: "British Psychological Society", detail: "Graduate Member (MBPsS)" },
    ],
  },
  {
    heading: "Certifications",
    icon: "sparkle" as DoodleName,
    items: [
      { title: "Johns Hopkins University", detail: "Psychological First Aid (PFA)" },
      { title: "National Institute on Drug Abuse", detail: "Good Clinical Practice (GCP)" },
      { title: "Swansea Bay University Health Board", detail: "Positive Behaviour Management" },
      { title: "Applied Behaviour Analysis (ABA)", detail: "Clinical training" },
      { title: "Research Minds UK", detail: "Advanced data & psychometric analysis" },
    ],
  },
  {
    heading: "Clinical experience",
    icon: "heart" as DoodleName,
    items: [
      { title: "Sit With It Therapy Hub", detail: "Associate Clinical Psychologist, online consultations" },
      { title: "Autism Life Centres (UK)", detail: "Neurodiversity care & routine adaptation" },
      { title: "PAF Hospital Psychiatric Dept.", detail: "Inpatient & outpatient diagnostic rotations" },
      { title: "Youth mental health research", detail: "Clinical research fellowships in developmental psychology" },
    ],
  },
];

// TODO: confirm these are real client words (with permission) before launch.
export const testimonials = [
  {
    quote:
      "The very first clinical space where I didn't feel catalogued or evaluated. She uncomplicates psychology in a way that lets you genuinely breathe and step out of panic mode.",
    who: "client, anxiety & panic",
  },
  {
    quote:
      "Evidence-based CBT tools with genuine empathy helped me through burnout and panic when everything felt unmanageable. Practical, warm, and deeply grounding.",
    who: "client, burnout",
  },
];

export const feed = [
  { src: "/images/ig/friends-success.jpg", alt: "Instagram post: Why your friend's success feels like your failure" },
  { src: "/images/ig/numb.jpg", alt: "Instagram post: Why everyone feels so numb lately" },
  { src: "/images/ig/lazy.jpg", alt: "Instagram post: Are you actually lazy, or is your brain just overwhelmed?" },
  { src: "/images/ig/pop-psych.jpg", alt: "Instagram post: Pop psychology vs clinical science" },
];

export const faqs = [
  {
    q: "Are sessions online?",
    a: "Yes. All sessions take place over secure video, so you can join from wherever you feel most comfortable.",
  },
  {
    q: "Who do you work with?",
    a: "Teens, young adults and adults. For anyone under 18, a parent or guardian is involved in the first contact.",
  },
  {
    q: "How does the free consultation work?",
    a: "You send a short request through the form. I read it, then reply with times for a free 15-minute fit check. It is a chance to ask questions and see if we're a good match. It isn't a therapy session.",
  },
  {
    q: "Is what I share confidential?",
    a: "Yes. Everything you share is kept private, within the standard professional limits that protect your safety, which we talk through at the start.",
  },
  {
    q: "What if I'm in crisis right now?",
    a: "This service isn't for emergencies. If you or someone else is in immediate danger, call your local emergency number or go to your nearest emergency department.",
  },
];
