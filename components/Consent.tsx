"use client";

import Link from "next/link";
import Script from "next/script";
import { createContext, useCallback, useContext, useEffect, useState, type ReactNode } from "react";

// Cookie and tracking consent for the EU/UK (GDPR, ePrivacy) and US states (CCPA/CPRA and similar).
// - Nothing non-essential runs until the visitor says yes. "Reject all" is as easy as "Accept all".
// - Google Consent Mode v2 starts as "denied" (see consentDefaults in the layout) and is updated here.
// - A browser Global Privacy Control signal is honoured as an opt-out of advertising ("sale/sharing").
// - GA4 and Google Ads tags only load after consent, and only when their IDs are set in the environment.

type Choice = { analytics: boolean; marketing: boolean; at: string; v: 1; gpc?: boolean };
import { CONSENT_KEY as KEY } from "@/lib/consent-defaults";
const OPEN_EVENT = "impsychout:open-consent";
const GA4 = process.env.NEXT_PUBLIC_GA4_ID;
const ADS = process.env.NEXT_PUBLIC_GOOGLE_ADS_ID;


const Ctx = createContext<{ choice: Choice | null; open: () => void }>({ choice: null, open: () => {} });
export const useConsent = () => useContext(Ctx);

function applyToGoogle(c: Choice) {
  const w = window as unknown as { gtag?: (...a: unknown[]) => void };
  w.gtag?.("consent", "update", {
    analytics_storage: c.analytics ? "granted" : "denied",
    ad_storage: c.marketing ? "granted" : "denied",
    ad_user_data: c.marketing ? "granted" : "denied",
    ad_personalization: c.marketing ? "granted" : "denied",
  });
}

export function ConsentProvider({ children }: { children: ReactNode }) {
  const [choice, setChoice] = useState<Choice | null>(null);
  const [ready, setReady] = useState(false);
  const [panel, setPanel] = useState<"banner" | "settings" | null>(null);
  const [draft, setDraft] = useState({ analytics: false, marketing: false });
  const gpc = typeof navigator !== "undefined" && (navigator as unknown as { globalPrivacyControl?: boolean }).globalPrivacyControl === true;

  useEffect(() => {
    try {
      const saved = JSON.parse(localStorage.getItem(KEY) ?? "null") as Choice | null;
      if (saved?.v === 1) {
        // a GPC signal always wins over an earlier "yes" to advertising
        const c = gpc && saved.marketing ? { ...saved, marketing: false, gpc: true } : saved;
        setChoice(c);
        applyToGoogle(c);
      } else setPanel("banner");
    } catch {
      setPanel("banner");
    }
    setReady(true);
    const open = () => setPanel("settings");
    window.addEventListener(OPEN_EVENT, open);
    return () => window.removeEventListener(OPEN_EVENT, open);
  }, [gpc]);

  useEffect(() => {
    if (panel === "settings") setDraft({ analytics: choice?.analytics ?? false, marketing: (choice?.marketing ?? false) && !gpc });
  }, [panel, choice, gpc]);

  const save = useCallback(
    (analytics: boolean, marketing: boolean) => {
      const c: Choice = { analytics, marketing: marketing && !gpc, at: new Date().toISOString(), v: 1, gpc: gpc || undefined };
      try {
        localStorage.setItem(KEY, JSON.stringify(c));
      } catch {}
      setChoice(c);
      applyToGoogle(c);
      setPanel(null);
    },
    [gpc]
  );

  return (
    <Ctx.Provider value={{ choice, open: () => setPanel("settings") }}>
      {children}

      {ready && choice?.analytics && GA4 && (
        <>
          <Script src={`https://www.googletagmanager.com/gtag/js?id=${GA4}`} strategy="afterInteractive" />
          <Script id="ga4" strategy="afterInteractive">{`gtag('js', new Date()); gtag('config', '${GA4}', { anonymize_ip: true });`}</Script>
        </>
      )}
      {ready && choice?.marketing && ADS && (
        <>
          {!GA4 && <Script src={`https://www.googletagmanager.com/gtag/js?id=${ADS}`} strategy="afterInteractive" />}
          <Script id="gads" strategy="afterInteractive">{`gtag('js', new Date()); gtag('config', '${ADS}');`}</Script>
        </>
      )}

      {panel && (
        <div className={`consent consent--${panel}`} role="dialog" aria-modal="false" aria-labelledby="consent-title">
          {panel === "banner" ? (
            <>
              <div className="consent__text">
                <p id="consent-title" className="consent__title">A quick word about cookies</p>
                <p>
                  We use only what&apos;s needed to run this site. With your permission we&apos;d also like to measure
                  visits and our adverts, so we can reach people who need support. You can change your mind any time.{" "}
                  <Link href="/cookies">Cookie policy</Link>
                </p>
                {gpc && <p className="consent__gpc">Your browser&apos;s Global Privacy Control signal is on, so advertising cookies stay off.</p>}
              </div>
              <div className="consent__actions">
                <button type="button" className="consent__btn" onClick={() => save(false, false)}>
                  Reject all
                </button>
                <button type="button" className="consent__btn" onClick={() => setPanel("settings")}>
                  Choose
                </button>
                <button type="button" className="consent__btn" onClick={() => save(true, true)}>
                  Accept all
                </button>
              </div>
            </>
          ) : (
            <>
              <p id="consent-title" className="consent__title">Your privacy choices</p>
              <ul className="consent__cats">
                <li>
                  <label>
                    <input type="checkbox" checked disabled />
                    <span>
                      <b>Essential</b> Keeps the site working and remembers your choices (sound, accessibility, this
                      setting). Always on.
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" checked={draft.analytics} onChange={(e) => setDraft((d) => ({ ...d, analytics: e.target.checked }))} />
                    <span>
                      <b>Analytics</b> Anonymous visit counts (Google Analytics) so we know what&apos;s helpful.
                    </span>
                  </label>
                </li>
                <li>
                  <label>
                    <input type="checkbox" checked={draft.marketing} disabled={gpc} onChange={(e) => setDraft((d) => ({ ...d, marketing: e.target.checked }))} />
                    <span>
                      <b>Advertising</b> Measures and personalises our adverts (Google Ads). In some US states this
                      counts as &quot;sharing&quot; personal information; leave it off to opt out.
                      {gpc && " Turned off by your Global Privacy Control signal."}
                    </span>
                  </label>
                </li>
              </ul>
              <div className="consent__actions">
                <button type="button" className="consent__btn" onClick={() => save(false, false)}>
                  Reject all
                </button>
                <button type="button" className="consent__btn" onClick={() => save(draft.analytics, draft.marketing)}>
                  Save choices
                </button>
                <button type="button" className="consent__btn" onClick={() => save(true, true)}>
                  Accept all
                </button>
              </div>
              <p className="consent__small">
                Read more in our <Link href="/privacy">Privacy Policy</Link> and <Link href="/cookies">Cookie Policy</Link>.
              </p>
            </>
          )}
        </div>
      )}
    </Ctx.Provider>
  );
}

// Footer links ("Cookie settings", "Your privacy choices") that reopen the settings panel.
export function ConsentLink({ children }: { children: ReactNode }) {
  return (
    <button type="button" className="consent-link" onClick={() => window.dispatchEvent(new Event(OPEN_EVENT))}>
      {children}
    </button>
  );
}
