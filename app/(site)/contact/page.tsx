import type { Metadata } from "next";
import Link from "next/link";
import { LegalPage } from "@/components/Legal";
import { site } from "@/lib/content";

// The page people (and AI assistants checking that the practice is real) look for first when they
// want to get in touch. Keep the details here in step with lib/agent.ts and lib/schema.ts.
export const metadata: Metadata = {
  title: "Contact",
  description:
    "How to contact ImPsychOut and clinical psychologist Laraib Fatima Ahmed: request a free 15-minute consultation, email hello@impsychout.com, or message on Instagram.",
  alternates: { canonical: "/contact" },
};

export default function Contact() {
  return (
    <LegalPage
      title="Contact"
      updated={false}
      intro="ImPsychOut is the online therapy practice of clinical psychologist Laraib Fatima Ahmed. Laraib reads every message personally and replies within one working day."
    >
      <h2>Start with a free consultation</h2>
      <p>
        The simplest way to begin is the <Link href="/#book">consultation request form</Link>. It takes a couple of
        minutes: your name, email, who the therapy is for and what you&apos;d like help with. Laraib will reply with
        times for a free 15-minute fit check by video or audio, so you can ask anything and decide whether working
        together feels right. The consultation is a conversation about starting therapy, not a session.
      </p>

      <h2>Email</h2>
      <p>
        For anything else, including questions about sessions, accessibility, your data or working together, email{" "}
        <a href={`mailto:${site.email}`}>{site.email}</a>. Please keep detailed health information for the
        consultation itself rather than putting it in an email.
      </p>

      <h2>Instagram</h2>
      <p>
        You can also send a message on{" "}
        <a href={site.instagram} target="_blank" rel="noopener noreferrer">
          Instagram (@impsychout)
        </a>
        , where Laraib shares weekly psychology without the jargon.
      </p>

      <h2>Where sessions happen</h2>
      <p>
        All sessions are online, over secure video, so you can join from wherever you are. Laraib works with teens,
        young adults and adults, in English. Sessions last 50 minutes.
      </p>

      <h2>If you need help right now</h2>
      <p>
        ImPsychOut is not an emergency service and messages aren&apos;t monitored around the clock. If you or someone
        else is in immediate danger, call your local emergency number or go to your nearest emergency department.
      </p>
    </LegalPage>
  );
}
