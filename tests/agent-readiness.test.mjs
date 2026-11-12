// End-to-end checks for what search engines, AI agents and Lighthouse read on the site.
// Runs against a running copy of the site (no extra packages, just Node's built-in test runner):
//   npm run build && npm start          then, in another terminal:
//   npm test                             (checks http://localhost:4321)
//   BASE_URL=https://www.impsychout.com npm test   (checks the live site)
import { test } from "node:test";
import assert from "node:assert/strict";

const BASE = (process.env.BASE_URL || "http://localhost:4321").replace(/\/$/, "");
const get = (path, init) => fetch(BASE + path, { redirect: "manual", ...init });
const text = async (path, init) => {
  const res = await get(path, init);
  return { res, body: await res.text() };
};
const visibleText = (html) =>
  html
    .replace(/<script[\s\S]*?<\/script>/g, "")
    .replace(/<style[\s\S]*?<\/style>/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/\s+/g, " ")
    .trim();

let home;
const homeHtml = async () => (home ??= (await text("/")).body);

function jsonLdGraph(html) {
  const blocks = [...html.matchAll(/<script type="application\/ld\+json"[^>]*>([\s\S]*?)<\/script>/g)].map((m) => JSON.parse(m[1]));
  return blocks.flatMap((b) => b["@graph"] ?? [b]);
}

test("llms.txt follows llmstxt.org and says when to use the practice", async () => {
  const { res, body } = await text("/llms.txt");
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/(markdown|plain)/);
  assert.match(body, /^# ImPsychOut\n\n> /, "starts with an H1 then a blockquote summary");
  assert.match(body, /^## When to use ImPsychOut$/m);
  assert.match(body, /^## How an agent should help someone get in touch$/m);
  assert.match(body, /\/contact\)/, "links the contact page");
  assert.doesNotMatch(body, /[–—]/, "house style: no en or em dashes");
});

test("llms-full.txt has every page in one file", async () => {
  const { res, body } = await text("/llms-full.txt");
  assert.equal(res.status, 200);
  assert.ok(body.length > 5000);
  assert.match(body, /hello@impsychout\.com/);
});

test("contact page is real, substantial and listed in the sitemap", async () => {
  const { res, body } = await text("/contact");
  assert.equal(res.status, 200);
  const main = visibleText(body.split("<main")[1] ?? body);
  assert.ok(main.length >= 500, `contact page has ${main.length} characters of text`);
  assert.match(body, /mailto:hello@impsychout\.com/);
  assert.match(body, /<link rel="canonical" href="https:\/\/www\.impsychout\.com\/contact"/);
  const sitemap = (await text("/sitemap.xml")).body;
  assert.match(sitemap, /<loc>https:\/\/www\.impsychout\.com\/contact<\/loc>/);
  assert.match(await homeHtml(), /href="\/contact"/, "footer links to it");
});

test("contact page has a Markdown version for agents", async () => {
  const { res, body } = await text("/contact", { headers: { Accept: "text/markdown" } });
  assert.equal(res.status, 200);
  assert.match(res.headers.get("content-type") ?? "", /text\/markdown/);
  assert.match(res.headers.get("vary") ?? "", /accept/i);
  assert.match(body, /^# Contact ImPsychOut/m);
});

test("practice schema has contact point, service terms and offers", async () => {
  const practice = jsonLdGraph(await homeHtml()).find((n) => n["@id"]?.endsWith("/#practice"));
  assert.ok(practice, "ProfessionalService node present");
  assert.equal(practice.contactPoint["@type"], "ContactPoint");
  assert.ok(practice.contactPoint.email && practice.contactPoint.contactType);
  assert.equal(practice.serviceType, "Online therapy");
  assert.match(practice.keywords, /online therapy/i);
  assert.ok(practice.knowsAbout.includes("Online therapy"));
  assert.ok(practice.hasOfferCatalog.itemListElement.length >= 5);
});

test("legal pages no longer show placeholder contact details", async () => {
  for (const path of ["/privacy", "/cookies", "/terms", "/accessibility"]) {
    const { body } = await text(path);
    assert.doesNotMatch(body, /\[contact email\]/, path);
  }
});

test("folder tab panels use an element that allows role=tabpanel", async () => {
  const html = await homeHtml();
  assert.doesNotMatch(html, /<article[^>]*role="tabpanel"/);
  assert.match(html, /<div[^>]*role="tabpanel"/);
});

test("hero intro is painted by CSS, not hidden until JavaScript runs", async () => {
  const html = await homeHtml();
  const lead = html.match(/<p class="lead[^"]*"[^>]*>/)?.[0] ?? "";
  assert.match(lead, /\brise\b/);
  assert.doesNotMatch(lead, /opacity:\s*0/);
});

test("cat art is lazy and right-sized", async () => {
  const imgs = (await homeHtml()).match(/<img[^>]*cat__pose[^>]*>/g) ?? [];
  assert.equal(imgs.length, 5);
  for (const img of imgs) {
    assert.match(img, /loading="lazy"/);
    assert.match(img, /srcSet="\/art\/[a-z-]+-sm\.webp \d+w, /i);
  }
  const small = await get("/art/pumpkin-trot-sm.webp");
  assert.equal(small.status, 200);
});

test("backend stays out of search and locked", async () => {
  const login = await get("/safehaven/login");
  assert.match(login.headers.get("x-robots-tag") ?? "", /noindex/);
  const upload = await get("/api/safehaven/upload", { method: "POST", body: "x" });
  assert.equal(upload.status, 401);
  const robots = (await text("/robots.txt")).body;
  assert.match(robots, /Disallow: \/safehaven/);
});
