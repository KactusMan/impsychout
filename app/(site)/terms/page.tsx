import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, LegalPage } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Terms of Use",
  description: "The terms for using the ImPsychOut website and requesting a free consultation.",
  alternates: { canonical: "/terms" },
};

export default function Terms() {
  return (
    <LegalPage title="Terms of Use" intro="By using this website you agree to these terms. They're short, and written to be read.">
      <h2>Not an emergency service</h2>
      <p>
        This website and the consultation form are not monitored around the clock and are not for emergencies. If you
        or someone else is in immediate danger, call your local emergency number or go to your nearest emergency
        department.
      </p>

      <h2>Information, not treatment</h2>
      <p>
        The content on this site is general information about mental health and therapy. It isn&apos;t a diagnosis,
        medical advice, or a substitute for care from a qualified professional who knows your situation. Results of
        therapy vary from person to person.
      </p>

      <h2>The free consultation</h2>
      <p>
        The free 15-minute consultation is a short conversation to see whether we&apos;re a good fit. It isn&apos;t a
        therapy session, and it doesn&apos;t create a therapist and client relationship. Either of us can decide not to
        go ahead. Fees, cancellations and confidentiality for ongoing sessions are agreed in writing before therapy
        starts.
      </p>

      <h2>Respectful use</h2>
      <p>
        Please use the form and our contact channels respectfully. We may decline or end a consultation that becomes
        abusive, inappropriate or unrelated to seeking therapy.
      </p>

      <h2>Content and intellectual property</h2>
      <p>
        The text, illustrations and design of this site belong to ImPsychOut. You&apos;re welcome to share links, but
        please don&apos;t copy content without permission.
      </p>

      <h2>Liability</h2>
      <p>
        We work hard to keep this site accurate and available, but we can&apos;t guarantee it will always be error-free
        or uninterrupted. Nothing in these terms limits liability that can&apos;t be limited by law.
      </p>

      <h2>Privacy</h2>
      <p>
        How we handle your information is explained in our <Link href="/privacy">Privacy Policy</Link> and{" "}
        <Link href="/cookies">Cookie Policy</Link>.
      </p>

      <h2>Contact</h2>
      <p>
        {CONTACT.name}, {CONTACT.address}. Email {CONTACT.email}.
      </p>
    </LegalPage>
  );
}
