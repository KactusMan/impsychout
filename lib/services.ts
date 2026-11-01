// One entry per service page (/services/[slug]). Plain, careful language:
// no outcome promises, no em dashes, clear about what online therapy can and can't do.
import type { DoodleName } from "./content";

export type Service = {
  slug: string;
  icon: DoodleName;
  name: string; // card title on the homepage
  short: string; // card body on the homepage
  metaTitle: string;
  metaDescription: string;
  h1: string;
  answer: string; // answer-first summary right under the H1
  signsTitle: string;
  signs: string[];
  help: { title: string; body: string }[];
  approaches: string[]; // ids from `approaches` in content.ts
  sessions: string;
  faqs: { q: string; a: string }[];
  related: string[];
};

export const services: Service[] = [
  {
    slug: "anxiety-and-panic",
    icon: "sun",
    name: "Anxiety & panic",
    short:
      "Understanding fight-or-flight triggers, calming rumination loops, and helping your nervous system feel safe again.",
    metaTitle: "Online Therapy for Anxiety and Panic Attacks",
    metaDescription:
      "Online therapy for anxiety and panic with clinical psychologist Laraib Fatima Ahmed. Evidence-based CBT and DBT skills to calm worry loops and panic. Free 15-minute consultation.",
    h1: "Online therapy for anxiety and panic",
    answer:
      "Anxiety therapy helps you understand why your body sounds the alarm, and gives you practical ways to settle it. With CBT and DBT skills, we work on the worry loops, the physical panic and the avoidance that keeps anxiety going, at a pace that feels manageable.",
    signsTitle: "You might recognise some of this",
    signs: [
      "Your mind replays conversations or races ahead to everything that could go wrong",
      "A racing heart, tight chest, shaky hands or a sudden wave of dread",
      "Panic that seems to come out of nowhere, sometimes at night",
      "Avoiding places, calls or plans because the anxiety beforehand is too much",
      "Feeling tired from being on high alert all day",
    ],
    help: [
      {
        title: "Making sense of the alarm",
        body: "Anxiety is your nervous system trying to protect you, just a little too loudly. We start by mapping what sets it off, what it feels like in your body, and what you do to cope. Understanding the cycle takes away a lot of its power.",
      },
      {
        title: "Skills for the moment",
        body: "You'll learn grounding and breathing techniques that work when panic is rising, plus ways to step back from anxious thoughts instead of arguing with them. We practise them in session so they feel familiar when you need them.",
      },
      {
        title: "Gently facing what you avoid",
        body: "Avoidance brings short-term relief but makes anxiety grow. Together we build small, planned steps back towards the things that matter to you, so your confidence comes from experience rather than reassurance.",
      },
    ],
    approaches: ["cbt", "dbt", "act"],
    sessions:
      "Sessions are 50 minutes over secure video. Most people meet weekly at first, then fortnightly as things settle. You'll leave each session with one or two small things to try, never a pile of homework.",
    faqs: [
      {
        q: "Can online therapy really help with panic attacks?",
        a: "Yes. CBT for panic is one of the most researched forms of therapy, and it works well over video. Many people find it easier to practise skills from their own home.",
      },
      {
        q: "Do I need a diagnosis of an anxiety disorder?",
        a: "No. You can come with everyday worry, stress that won't switch off, or something you can't quite name yet. We'll make sense of it together.",
      },
      {
        q: "What if I have a panic attack during a session?",
        a: "That's okay, and it happens. I'll guide you through it calmly, and it can be a useful chance to practise the skills with support.",
      },
    ],
    related: ["depression-and-low-mood", "ocd-and-intrusive-thoughts", "individual-therapy"],
  },
  {
    slug: "depression-and-low-mood",
    icon: "cloud",
    name: "Depression & low mood",
    short:
      "Compassionate support through numbness, fatigue and self-criticism, and a gentle reconnection with what makes you feel alive.",
    metaTitle: "Online Therapy for Depression and Low Mood",
    metaDescription:
      "Gentle, evidence-based online therapy for depression and low mood with clinical psychologist Laraib Fatima Ahmed. Work through numbness, fatigue and self-criticism. Free consultation.",
    h1: "Online therapy for depression and low mood",
    answer:
      "Therapy for depression gives you a steady, non-judgmental space to understand what's weighing you down and to rebuild energy and meaning in small, realistic steps. We use CBT and behavioural activation alongside a lot of compassion for how hard this feels.",
    signsTitle: "It might look like this",
    signs: [
      "Feeling flat, numb or heavy most days",
      "Losing interest in things that used to bring you joy",
      "Sleeping too much or too little, and feeling tired either way",
      "A harsh inner voice that tells you you're not enough",
      "Pulling away from people, then feeling lonely",
    ],
    help: [
      {
        title: "Being met where you are",
        body: "When you're low, even getting to a session can feel like a lot. We'll go at your pace, and there's no pressure to have the right words. Understanding comes first; change follows.",
      },
      {
        title: "Small actions, real momentum",
        body: "Depression tells you to wait until you feel better before doing anything. Behavioural activation turns that around: we pick small, doable actions linked to what you value, because mood often follows movement.",
      },
      {
        title: "Softening the inner critic",
        body: "We look at the thoughts that keep you stuck, such as 'what's the point' or 'I always mess things up', and practise answering them with more balance and kindness.",
      },
    ],
    approaches: ["cbt", "act", "rebt"],
    sessions:
      "We usually meet weekly for 50 minutes over video. Some weeks will feel lighter than others, and that's part of it. We review progress together regularly so you always know where you are.",
    faqs: [
      {
        q: "Is therapy enough, or do I need medication too?",
        a: "For many people therapy alone helps; for others a combination works best. I'm not able to prescribe, but I can help you think it through and work alongside your GP or psychiatrist.",
      },
      {
        q: "What if I don't know what to talk about?",
        a: "That's very common with low mood. I'll guide the conversation with gentle questions, so you never have to arrive with a plan.",
      },
      {
        q: "What if I have thoughts of ending my life?",
        a: "Please tell me. We can talk about it openly and safely. If you're in immediate danger, contact your local emergency number or go to your nearest emergency department right away.",
      },
    ],
    related: ["anxiety-and-panic", "individual-therapy", "personality-disorders"],
  },
  {
    slug: "ocd-and-intrusive-thoughts",
    icon: "loop",
    name: "OCD & intrusive thoughts",
    short:
      "Evidence-informed tools, including ERP foundations, to ease fear spirals without giving in to compulsions.",
    metaTitle: "Online Therapy for OCD and Intrusive Thoughts",
    metaDescription:
      "Online therapy for OCD and intrusive thoughts using CBT and ERP foundations, with clinical psychologist Laraib Fatima Ahmed. Calm the fear spiral without compulsions. Free consultation.",
    h1: "Online therapy for OCD and intrusive thoughts",
    answer:
      "Therapy for OCD helps you change your relationship with intrusive thoughts so they lose their grip. Using CBT and Exposure and Response Prevention (ERP) foundations, we gently reduce the checking, reassurance-seeking and rituals that keep the fear cycle turning.",
    signsTitle: "OCD can show up as",
    signs: [
      "Unwanted thoughts or images that feel shocking or 'not like you'",
      "Needing things to feel 'just right' before you can move on",
      "Checking, cleaning, counting or repeating to ease the anxiety",
      "Asking others for reassurance, again and again",
      "Spending a lot of time each day caught in mental loops",
    ],
    help: [
      {
        title: "Thoughts are not facts",
        body: "Almost everyone has strange or upsetting thoughts. OCD makes them feel urgent and meaningful. We start by understanding that cycle, which on its own often brings real relief and less shame.",
      },
      {
        title: "Step by step, at your pace",
        body: "ERP means facing feared situations in small, planned steps while resisting the urge to neutralise them. You're always in control of the pace, and nothing happens without your agreement.",
      },
      {
        title: "Making room for uncertainty",
        body: "OCD demands certainty. We practise tolerating 'maybe' with ACT skills, so you can get on with your day even when a thought shows up.",
      },
    ],
    approaches: ["cbt", "act", "dbt"],
    sessions:
      "OCD work is usually weekly, 50 minutes over video. Between sessions you'll practise small exposure steps we've planned together, and we'll adjust them as you go.",
    faqs: [
      {
        q: "Can ERP be done online?",
        a: "Yes. Many exposure exercises happen naturally at home, where the triggers are. We plan them together and review how they went.",
      },
      {
        q: "My thoughts are too embarrassing to say out loud.",
        a: "Intrusive thoughts often are, and that's exactly why OCD thrives on silence. There's nothing you can tell me that will shock me, and naming them is part of taking their power away.",
      },
      {
        q: "Is it OCD or just anxiety?",
        a: "They overlap. In the first sessions we'll look at your patterns together and make sense of what's going on before deciding on a plan.",
      },
    ],
    related: ["anxiety-and-panic", "neurodiversity-and-autism", "individual-therapy"],
  },
  {
    slug: "neurodiversity-and-autism",
    icon: "butterfly",
    name: "Neurodiversity & autism",
    short:
      "Affirming support for autistic and ADHD people: unmasking safely, sensory profiling and executive-function scaffolding.",
    metaTitle: "Neurodiversity-Affirming Therapy for Autism and ADHD",
    metaDescription:
      "Neurodiversity-affirming online therapy for autistic and ADHD adults and teens with Laraib Fatima Ahmed. Unmasking safely, sensory needs and executive-function support. Free consultation.",
    h1: "Neurodiversity-affirming therapy for autism and ADHD",
    answer:
      "Neurodiversity-affirming therapy doesn't try to make you less autistic or less ADHD. It helps you understand your own wiring, unmask safely, meet your sensory needs and build routines that actually work for your brain.",
    signsTitle: "You might be looking for support with",
    signs: [
      "Feeling exhausted from masking at work, school or with family",
      "Burnout, shutdowns or meltdowns after too much input",
      "A late-in-life realisation that you might be autistic or ADHD",
      "Struggling to start, switch or finish tasks",
      "Anxiety or low mood that sits on top of all of the above",
    ],
    help: [
      {
        title: "Understanding your profile",
        body: "We explore your sensory preferences, energy patterns and communication style. Many people find this alone takes away years of self-blame.",
      },
      {
        title: "Unmasking safely",
        body: "Masking can protect you, but it's costly. Together we work out where it's safe to drop it, and how to set boundaries where it isn't.",
      },
      {
        title: "Scaffolding, not willpower",
        body: "Executive-function support is about building your environment around your brain: visual systems, body-doubling ideas, realistic routines and plans for low-energy days.",
      },
    ],
    approaches: ["pbm", "act", "cbt"],
    sessions:
      "Sessions are flexible: camera on or off, written chat alongside video, breaks when needed, and clear agendas if that helps. We'll shape the format around what's comfortable for you.",
    faqs: [
      {
        q: "Do I need a formal diagnosis to come?",
        a: "No. Self-identified and questioning people are very welcome. If you're thinking about a formal diagnosis, I can help you understand the options and next steps.",
      },
      {
        q: "Do you work with autistic teenagers?",
        a: "Yes. For anyone under 18, a parent or guardian is involved at the first contact, and we agree together how they'll be included.",
      },
      {
        q: "Will therapy try to change who I am?",
        a: "No. The aim is to reduce distress and help you live in a way that fits you, not to train you to look neurotypical.",
      },
    ],
    related: ["psychological-assessment", "anxiety-and-panic", "individual-therapy"],
  },
  {
    slug: "personality-disorders",
    icon: "heart",
    name: "Personality disorders",
    short: "DBT-informed skills for emotional resilience, distress tolerance, relationships and self-acceptance.",
    metaTitle: "DBT-Informed Therapy for Personality Disorders",
    metaDescription:
      "Online DBT-informed therapy for emotional intensity, relationships and personality disorders, including BPD, with clinical psychologist Laraib Fatima Ahmed. Free 15-minute consultation.",
    h1: "DBT-informed therapy for personality disorders",
    answer:
      "If emotions hit hard and fast, relationships feel stormy, or you've been given a personality disorder diagnosis such as BPD, DBT-informed therapy can help. We build practical skills for intense feelings and relationships, with warmth and without judgment.",
    signsTitle: "This might sound familiar",
    signs: [
      "Emotions that go from zero to a hundred very quickly",
      "Fear of being left, or pushing people away before they can leave",
      "Acting on urges you later regret",
      "Feeling empty, or unsure who you really are",
      "Having been told you're 'too much'",
    ],
    help: [
      {
        title: "Riding the wave",
        body: "DBT teaches distress tolerance and emotion regulation: concrete skills for getting through the hardest moments without making things worse, and for lowering how often those moments arrive.",
      },
      {
        title: "Steadier relationships",
        body: "Interpersonal effectiveness skills help you ask for what you need, say no, and keep self-respect, even when emotions are running high.",
      },
      {
        title: "Both things can be true",
        body: "A core DBT idea is holding acceptance and change together. You can be doing your best and still want to do better. We hold both with you.",
      },
    ],
    approaches: ["dbt", "cbt", "act"],
    sessions:
      "We usually meet weekly for 50 minutes over video. We'll agree a clear plan for difficult moments early on, so you know what to do between sessions.",
    faqs: [
      {
        q: "Is this full DBT?",
        a: "This is individual, DBT-informed therapy. Full DBT programmes also include group skills training and phone coaching. If you need that level of support, I'll help you find it.",
      },
      {
        q: "I don't have a diagnosis but this sounds like me.",
        a: "You don't need one. These skills help many people with intense emotions, whatever the label.",
      },
      {
        q: "What happens if I'm in crisis between sessions?",
        a: "We'll make a safety plan together. This service isn't for emergencies, so if you're in immediate danger please call your local emergency number.",
      },
    ],
    related: ["depression-and-low-mood", "anxiety-and-panic", "individual-therapy"],
  },
  {
    slug: "individual-therapy",
    icon: "plane",
    name: "Individual therapy",
    short:
      "A gentle, confidential one-to-one space to untangle complex emotions, navigate life transitions and understand yourself.",
    metaTitle: "Individual Online Therapy and Counselling",
    metaDescription:
      "Confidential one-to-one online therapy with clinical psychologist Laraib Fatima Ahmed. Untangle complex emotions, life transitions and relationships. Free 15-minute consultation.",
    h1: "Individual online therapy and counselling",
    answer:
      "Individual therapy is a confidential one-to-one space to talk through what's on your mind with a clinical psychologist. You don't need a diagnosis or a crisis. Many people come because something feels stuck and they want to understand themselves better.",
    signsTitle: "People often come for",
    signs: [
      "Big life changes: moving, graduating, relationships, loss",
      "Stress, burnout or feeling stretched too thin",
      "Patterns in relationships that keep repeating",
      "Grief, family pressure or cultural expectations",
      "Wanting to understand yourself, not just cope",
    ],
    help: [
      {
        title: "A space that's just yours",
        body: "No one to look after, no performance needed. Therapy is somewhere you can think out loud and be met with warmth.",
      },
      {
        title: "Making sense of patterns",
        body: "We gently look at where your patterns come from and what they're protecting, so change feels possible rather than forced.",
      },
      {
        title: "Tools that fit your life",
        body: "Drawing on CBT, ACT and other approaches, we choose what suits you and your culture, rather than a one-size-fits-all plan.",
      },
    ],
    approaches: ["cbt", "act", "eidetic"],
    sessions:
      "Sessions are 50 minutes over secure video, weekly or fortnightly. You can be anywhere you feel comfortable and private.",
    faqs: [
      {
        q: "How many sessions will I need?",
        a: "It varies. Some people come for six to eight sessions with a focused goal; others prefer longer-term support. We'll review together regularly.",
      },
      {
        q: "Do you understand South Asian family dynamics?",
        a: "Yes. Cultural context matters, and you won't need to explain or defend your background to be understood.",
      },
      {
        q: "Is it okay if I just want to talk?",
        a: "Absolutely. Talking is where it starts, and we can add tools only if and when they're helpful.",
      },
    ],
    related: ["anxiety-and-panic", "depression-and-low-mood", "personality-disorders"],
  },
  {
    slug: "psychological-assessment",
    icon: "star",
    name: "Psychological assessment",
    short: "Structured evaluations and psychometric profiling that guide focused, personalised next steps.",
    metaTitle: "Online Psychological Assessment and Psychometric Profiling",
    metaDescription:
      "Structured online psychological assessment and psychometric profiling with clinical psychologist Laraib Fatima Ahmed, to understand your needs and plan next steps clearly.",
    h1: "Online psychological assessment",
    answer:
      "A psychological assessment is a structured way to understand what's going on for you, using clinical interviews and validated questionnaires. It gives you a clear picture of your strengths and difficulties, and a plan for what might help next.",
    signsTitle: "An assessment can help when",
    signs: [
      "You've struggled for a while and want a clearer picture",
      "You're unsure which type of support would suit you",
      "School, work or family have raised questions you want to explore",
      "You want a structured starting point before therapy",
      "You need a written summary to share with other professionals",
    ],
    help: [
      {
        title: "A clear, structured process",
        body: "We'll talk through your history and current difficulties in depth, and use validated psychometric measures chosen for your questions.",
      },
      {
        title: "Results in plain language",
        body: "You'll get feedback in a session, explained without jargon, and a written summary with practical recommendations.",
      },
      {
        title: "Honest about scope",
        body: "Some diagnoses need specialist or in-person assessment. If that's the case for you, I'll tell you clearly and help you find the right referral route.",
      },
    ],
    approaches: ["cbt", "pbm"],
    sessions:
      "An assessment usually takes two to four sessions over video, followed by a feedback session. We'll agree the scope and timeline before we start.",
    faqs: [
      {
        q: "Can you diagnose autism or ADHD online?",
        a: "Formal diagnostic pathways vary by country and often require specialist teams. I offer structured screening and profiling, and can guide you to the right diagnostic service where needed.",
      },
      {
        q: "Will I get a written report?",
        a: "Yes, you'll receive a written summary of findings and recommendations that you can choose to share.",
      },
      {
        q: "Is an assessment the same as therapy?",
        a: "No. It's a focused piece of work to understand what's happening. Many people go on to therapy afterwards, but there's no obligation.",
      },
    ],
    related: ["neurodiversity-and-autism", "anxiety-and-panic", "individual-therapy"],
  },
];

export const serviceBySlug = (slug: string) => services.find((s) => s.slug === slug);
