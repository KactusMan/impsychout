import type { Metadata } from "next";
import { ConsentLink } from "@/components/Consent";
import { CONTACT, LegalPage } from "@/components/Legal";

export const metadata: Metadata = {
  title: "Cookie Policy",
  description: "The cookies and similar technologies ImPsychOut uses, and how to change your choices.",
  alternates: { canonical: "/cookies" },
};

export default function Cookies() {
  return (
    <LegalPage
      title="Cookie Policy"
      intro="We keep tracking to a minimum. Only essential storage runs by default; analytics and advertising cookies only run if you say yes."
    >
      <h2>Change your choices</h2>
      <p>
        You can change or withdraw your consent at any time: <ConsentLink>open cookie settings</ConsentLink>.
      </p>

      <h2>What we use</h2>
      <div className="legal__table" role="region" aria-label="Cookies and storage" tabIndex={0}>
        <table>
          <thead>
            <tr>
              <th scope="col">Name</th>
              <th scope="col">Type</th>
              <th scope="col">Purpose</th>
              <th scope="col">Duration</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>impsychout:consent</td>
              <td>Essential (local storage)</td>
              <td>Remembers your cookie choices</td>
              <td>Until you clear it</td>
            </tr>
            <tr>
              <td>impsychout:sound, impsychout:a11y</td>
              <td>Essential (local storage)</td>
              <td>Remembers your sound and accessibility settings</td>
              <td>Until you clear it</td>
            </tr>
            <tr>
              <td>_ga, _ga_*</td>
              <td>Analytics (only with consent)</td>
              <td>Google Analytics: counts visits and how the site is used</td>
              <td>Up to 14 months</td>
            </tr>
            <tr>
              <td>_gcl_au, _gcl_aw</td>
              <td>Advertising (only with consent)</td>
              <td>Google Ads: measures whether adverts lead to enquiries</td>
              <td>Up to 90 days</td>
            </tr>
          </tbody>
        </table>
      </div>
      <p>
        We use Google Consent Mode, so Google tags stay in a &quot;denied&quot; state until you allow them. Your
        browser&apos;s Global Privacy Control signal is treated as a &quot;no&quot; to advertising.
      </p>

      <h2>Questions</h2>
      <p>Email {CONTACT.email}.</p>
    </LegalPage>
  );
}
