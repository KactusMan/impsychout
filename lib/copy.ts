// Every piece of text on the site, in one place. These are the defaults; anything Laraib
// changes in /safehaven is saved separately and laid over the top (see lib/cms.ts).
// Write **like this** to make words bold. No em dashes, please.
import { approaches, credentials, faqs, feed, site, steps, testimonials } from "./content";
import { services } from "./services";

export const defaultCopy = {
  site: {
    title: site.title,
    description: site.description,
    instagram: site.instagram,
  },
  hero: {
    hello: "hi, welcome to ImPsychOut",
    line1: "Stop navigating it alone.",
    line2: "Let's make sense of it",
    underlined: "together.",
    lead: "Online therapy for teens, young adults and adults with clinical psychologist Laraib Fatima Ahmed. Psychology, uncomplicated: compassionate, evidence-based care for real minds living in a complex world.",
    primaryButton: "Request a free consultation",
    secondaryButton: "See how I can help",
    trust: ["Confidential online sessions", "Evidence-based: CBT, DBT, ACT", "BPS Graduate Member"],
    photoCaption: "hi, I'm Laraib ♡",
    note: "a place to uncomplicate your thoughts & heal at your own pace",
    stickers: ["Trauma-informed", "Safe & seen", "Emotion regulation"],
    dragHint: "psst, you can move things around",
    tidyButton: "Tidy up",
  },
  untangle: {
    eyebrow: "Every mind has a story",
    title: "Untangling it,",
    titleEmphasis: "together",
    body: "Thoughts loop. They knot up around the things that matter most to us. Therapy is a slow, gentle unknotting, until there's room to breathe again. Scroll and watch.",
    loopLabel: "the loop",
    reframeLabel: "a kinder thought",
    thoughts: [
      { worry: "What if I mess it all up?", reframe: "What if it goes okay? And if it doesn't, I can handle that too." },
      { worry: "I should be over this by now.", reframe: "Healing doesn't run on a schedule." },
      { worry: "I'm too much for people.", reframe: "The right people make room for me." },
      { worry: "Nobody would understand.", reframe: "Being understood starts with being heard." },
    ],
    button: "Let's untangle it together",
  },
  about: {
    eyebrow: "About my practice",
    title: "Understanding, not diagnosing.",
    lede: "Hi, I'm Laraib Fatima Ahmed. In a world that often demands non-stop productivity and quiet suffering, finding a genuinely non-judgmental space can feel transformative.",
    paragraphs: [
      "Healing begins when we remove the shame and confusion around mental health. My clinical work blends rigorous science, including Cognitive Behavioural Therapy (CBT) and Dialectical Behaviour Therapy (DBT), with genuine human warmth and cultural understanding. I've worked across clinical settings in the UK and in international online therapy.",
      "You'll never be treated like a list of symptoms. Together, we untangle persistent thought loops, build a sense of safety in your body, and shape a life that feels like your own.",
    ],
    chips: [
      { label: "MSc", text: "Clinical Psychology, with Merit" },
      { label: "BPS", text: "Graduate Member (MBPsS)" },
      { label: "UK", text: "& international clinical experience" },
    ],
    noteTitle: "beyond the clinic",
    noteBody: "Reader of existential philosophy, reflective essayist, musician, cosy gamer, and proud cat mom to two delightfully chaotic felines.",
    playHint: "move your cursor in here, Pumpkin is ready",
    pumpkin: "Chases everything. Zero chill. Will pounce on your cursor.",
    daisy: "Supervises. Gets there eventually, then has a little lie down.",
  },
  care: {
    eyebrow: "Specialised care",
    title: "Pull up a chair, here's what we can work on",
    sub: "Tailored, collaborative care designed around your neurotype, life stage and lived experience.",
    readMore: "Read more",
    nudge: "not sure where you fit? that's okay, that's what the free consultation is for",
    button: "Request a free consultation",
  },
  approach: {
    eyebrow: "How I work",
    title: "Frameworks,",
    titleEmphasis: "uncomplicated",
    sub: "Therapeutic science explained in clear, friendly language. No cold clinical jargon or distant acronyms.",
    folderTab: "L. F. Ahmed · approaches",
    folderLabel: "Frameworks, uncomplicated",
    folderHint: "pull a divider to read",
    items: approaches,
  },
  process: {
    eyebrow: "What to expect",
    title: "Starting therapy shouldn't feel scary.",
    sub: "Here's the gentle, four-step path from first hello to steady growth.",
    steps,
    between: "then",
    lastLink: "Start with step one",
  },
  credentials: {
    eyebrow: "Clinical credentials & training",
    title: "Grounded in British & international standards.",
    groups: credentials,
  },
  kindWords: {
    eyebrow: "Kind words",
    title: "Notes from people who've sat in the chair.",
    sub: "Names are always kept private, because your story is yours.",
    greeting: "dear Laraib,",
    letters: testimonials,
    footer: "Every first conversation starts the same way: with you being heard.",
    footerLink: "Request a free consultation",
  },
  feed: {
    eyebrow: "@impsychout",
    title: "Fresh from the feed",
    sub: "Gentle reminders and psychology, minus the jargon, every week on Instagram.",
    posts: feed,
    button: "Follow on Instagram",
  },
  faq: {
    eyebrow: "Good questions",
    title: "Before you reach out",
    items: faqs,
  },
  booking: {
    eyebrow: "Start with a conversation",
    titleStart: "Let's talk about how",
    titleEmphasis: "you",
    titleEnd: "cope",
    body: "Not sure if online therapy or my style is right for you? Send a short request and I'll get back to you with times for a **free 15-minute fit check** by video or audio. Ask anything, get comfortable, then decide.",
    note: "**Private and personal.** I read every request myself. The free consultation is a short fit check about therapy, not a session.",
    crisis: "**In crisis?** This form isn't monitored around the clock. If you or someone else is in immediate danger, call your local emergency number or go to your nearest emergency department.",
    formTitle: "Request a consultation",
    required: "Fields marked * are required.",
    consent: "I understand the free consultation is a short, respectful conversation about starting therapy, and is not a therapy session. *",
    privacyConsent: "I agree to ImPsychOut using what I share here, including anything about my health, only to reply to my request, as explained in the Privacy Policy. *",
    button: "Send my request",
    thanks: "Thank you, {name}. I'll reply within one working day.",
  },
  footer: {
    blurb: "Online therapy with clinical psychologist Laraib Fatima Ahmed. Uncomplicating psychology, one gentle conversation at a time.",
    sign: "with care, Laraib",
    legal: "Not an emergency service.",
  },
  services,
};

export type Copy = typeof defaultCopy;

// Keys that hold technical values rather than words; the editor hides them.
export const HIDDEN_KEYS = new Set(["id", "slug", "icon", "color", "tone", "src", "related", "approaches"]);
