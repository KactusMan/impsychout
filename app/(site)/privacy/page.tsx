import type { Metadata } from "next";
import Link from "next/link";
import { CONTACT, LegalPage } from "@/components/Legal";
import { ConsentLink } from "@/components/Consent";

export const metadata: Metadata = {
  title: "Privacy Policy",
  description: "How ImPsychOut collects, uses and protects your personal information, including health information you choose to share.",
  alternates: { canonical: "/privacy" },
};

export default function Privacy() {
  return (
    <LegalPage
      title="Privacy Policy"
      intro="Your privacy matters, especially when you're reaching out about your mental health. This page explains, in plain language, what we collect, why, and the choices and rights you have."
    >
      <h2>Who we are</h2>
      <p>
        This website is run by {CONTACT.name} (&quot;ImPsychOut&quot;, &quot;we&quot;, &quot;I&quot;). For anything to do
        with your data, contact {CONTACT.email}. Our address is {CONTACT.address}. We are the data controller for
        the information described here.
      </p>

      <h2>What we collect</h2>
      <ul>
        <li>
          <b>Consultation requests.</b> Your name, email, and anything else you choose to give us: pronouns, phone or
          WhatsApp number, who the therapy is for, the area you&apos;d like help with, and your message. Your message may
          include information about your health.
        </li>
        <li>
          <b>Preferences stored on your device.</b> Your sound, accessibility and cookie choices, saved in your
          browser&apos;s local storage so the site remembers them. These never leave your device.
        </li>
        <li>
          <b>Analytics and advertising data, only with your consent.</b> If you allow it, Google Analytics measures
          visits (pages viewed, approximate location, device type) and Google Ads measures whether our adverts lead to
          enquiries. See our <Link href="/cookies">Cookie Policy</Link>.
        </li>
      </ul>

      <h2>Why we use it, and our legal basis</h2>
      <ul>
        <li>
          <b>To reply to your request and arrange a free consultation.</b> Legal basis: steps you ask us to take before
          entering into an agreement (UK/EU GDPR Article 6(1)(b)). Because a message may include health information,
          which is special category data, we only process it with your explicit consent (Article 9(2)(a)), which you
          give with the checkbox on the form. You can withdraw it at any time by emailing us.
        </li>
        <li>
          <b>To understand and improve the site, and measure our adverts.</b> Legal basis: your consent (Article
          6(1)(a)), given through the cookie banner.
        </li>
        <li>
          <b>To keep the site secure and working.</b> Legal basis: our legitimate interests (Article 6(1)(f)).
        </li>
      </ul>
      <p>We never sell your information, and we never use what you tell us about your health for advertising.</p>

      <h2>Who we share it with</h2>
      <ul>
        <li>
          <b>Vercel</b> hosts the website. <b>Resend</b> delivers consultation requests to our inbox by email.
        </li>
        <li>
          <b>Google</b> (Analytics and Ads), only if you consent to those cookies.
        </li>
        <li>Professional advisers or authorities, only where the law requires it or to protect someone&apos;s safety.</li>
      </ul>
      <p>
        Some of these providers are based in the United States. Where your data leaves the UK or EEA, we rely on
        safeguards such as the UK-US Data Bridge, the EU-US Data Privacy Framework, or Standard Contractual Clauses.
      </p>

      <h2>How long we keep it</h2>
      <p>
        Consultation requests are kept for up to 12 months if you don&apos;t go on to start therapy, then deleted. If you
        become a client, your records are kept as professional guidelines require. Analytics data is kept for 14
        months.
      </p>

      <h2>Your rights (UK and EU)</h2>
      <p>
        You can ask to access, correct, delete, restrict or move your data, object to how we use it, and withdraw
        consent at any time. Email {CONTACT.email}; we&apos;ll reply within one month. You can also complain to the UK
        Information Commissioner&apos;s Office (ico.org.uk) or your local data protection authority.
      </p>

      <h2>Your rights (US states)</h2>
      <p>
        If you live in California, Colorado, Connecticut, Virginia, Washington or another state with a privacy law,
        you can ask to know, access, correct or delete the personal information we hold, and opt out of targeted
        advertising or the &quot;sale&quot; or &quot;sharing&quot; of your information. We don&apos;t sell personal
        information. Advertising cookies may count as &quot;sharing&quot; under some laws, so they&apos;re off unless
        you turn them on, and we honour Global Privacy Control signals. Use <ConsentLink>Your privacy choices</ConsentLink>{" "}
        or email us. We won&apos;t treat you differently for using these rights. Health information you send us is
        consumer health data under laws like Washington&apos;s My Health My Data Act: we only use it to respond to you,
        never sell it, and you can ask us to delete it.
      </p>

      <h2>Children</h2>
      <p>
        We work with teenagers, but a parent or guardian must make the first contact for anyone under 18. We don&apos;t
        knowingly collect information directly from children under 13 (or under 16 in the EU) without parental
        consent.
      </p>

      <h2>Keeping it safe</h2>
      <p>
        The site uses HTTPS encryption, and requests are delivered to a private inbox that only Laraib reads. No
        method of transmission is perfectly secure, so please share only what you&apos;re comfortable with.
      </p>

      <h2>Changes</h2>
      <p>If we change this policy, we&apos;ll update the date at the top of the page.</p>
    </LegalPage>
  );
}
