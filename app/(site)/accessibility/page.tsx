import type { Metadata } from "next";
import { CONTACT, LegalPage } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Accessibility Statement",
  description: "How ImPsychOut works to be accessible to everyone, the tools on the site, and how to tell us about a barrier.",
  alternates: { canonical: "/accessibility" },
};

export default function Accessibility() {
  return (
    <LegalPage
      title="Accessibility Statement"
      intro="Everyone deserves a calm, easy way to reach out for support. We aim for this site to meet the Web Content Accessibility Guidelines (WCAG) 2.2 at level AA."
    >
      <h2>What we&apos;ve done</h2>
      <ul>
        <li>Every page works with a keyboard, with a visible focus outline and a &quot;Skip to content&quot; link.</li>
        <li>Images have text alternatives, and decorative illustrations are hidden from screen readers.</li>
        <li>Headings, landmarks, form labels and error messages are set up for screen readers.</li>
        <li>Text and controls are designed to meet colour-contrast requirements, and pages reflow on small screens and at 400% zoom.</li>
        <li>Animation respects your device&apos;s &quot;reduce motion&quot; setting, and sound is off until you turn it on.</li>
      </ul>

      <h2>The accessibility toolbar</h2>
      <p>
        Use the round button in the bottom-left corner of any page to adjust the site to you. Your settings are
        remembered on this device:
      </p>
      <ul>
        <li>Text size, high contrast, a highly readable font, and extra text spacing</li>
        <li>Highlighted links, a reading guide and a bigger cursor</li>
        <li>Pause all motion, mute all sounds, or reduce colour</li>
      </ul>

      <h2>Known limitations</h2>
      <ul>
        <li>
          Some playful parts (dragging the hero collage, the cats chasing your cursor) need a pointer. Everything they
          say is also available as text, and nothing important depends on them.
        </li>
        <li>Instagram posts are shown as images; the text of each post is in its description.</li>
      </ul>

      <h2>Tell us about a barrier</h2>
      <p>
        If anything on this site is hard to use, or you need information in another format, email {CONTACT.email}. We
        aim to reply within five working days. If you&apos;re in the UK and not happy with our response, you can contact
        the Equality Advisory and Support Service (EASS).
      </p>

      <h2>How we checked</h2>
      <p>
        This statement is based on a self-assessment, including keyboard and screen reader checks, automated testing
        and manual review against WCAG 2.2 AA.
      </p>
    </LegalPage>
  );
}
