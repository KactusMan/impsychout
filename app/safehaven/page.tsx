import { getCopy, storageReady } from "@/lib/cms";
import { defaultCopy } from "@/lib/copy";
import { Dashboard } from "./Dashboard";

export const dynamic = "force-dynamic";
export const metadata = { title: "Dashboard" };

export default async function SafeHaven() {
  const copy = await getCopy();
  return (
    <Dashboard
      initial={copy}
      defaults={defaultCopy}
      storage={storageReady()}
      insights={{
        ga4Tag: Boolean(process.env.NEXT_PUBLIC_GA4_ID),
        ga4Api: Boolean(process.env.GA4_PROPERTY_ID && process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
        searchConsole: Boolean(process.env.GSC_SITE_URL && process.env.GOOGLE_SERVICE_ACCOUNT_JSON),
        ads: Boolean(process.env.NEXT_PUBLIC_GOOGLE_ADS_ID),
      }}
    />
  );
}
