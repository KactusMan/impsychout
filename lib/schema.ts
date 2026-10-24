import { approaches, faqs, focusAreas, site } from "./content";

// Structured data (schema.org JSON-LD) so search engines and AI agents can read who Laraib is,
// what the practice offers and how to get in touch, without parsing the design.
export const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      "@id": `${site.url}/#website`,
      url: site.url,
      name: site.name,
      description: site.description,
      inLanguage: "en-GB",
      publisher: { "@id": `${site.url}/#practice` },
    },
    {
      "@type": "Person",
      "@id": `${site.url}/#laraib`,
      name: site.therapist,
      jobTitle: "Clinical Psychologist",
      url: site.url,
      image: `${site.url}/images/laraib-portrait.jpg`,
      sameAs: [site.instagram],
      alumniOf: [{ "@type": "CollegeOrUniversity", name: "Air University" }],
      memberOf: { "@type": "Organization", name: "British Psychological Society" },
      hasCredential: [
        { "@type": "EducationalOccupationalCredential", name: "MSc Clinical Psychology" },
        { "@type": "EducationalOccupationalCredential", name: "BS (Hons) Psychology" },
        { "@type": "EducationalOccupationalCredential", name: "Psychological First Aid, Johns Hopkins University" },
      ],
      knowsAbout: [...focusAreas.map((f) => f.title), ...approaches.map((a) => a.name)],
      worksFor: { "@id": `${site.url}/#practice` },
    },
    {
      "@type": ["ProfessionalService", "MedicalBusiness"],
      "@id": `${site.url}/#practice`,
      name: site.name,
      slogan: "Your safe space to talk",
      url: site.url,
      logo: `${site.url}/images/logo.png`,
      image: `${site.url}/images/laraib-portrait.jpg`,
      description: site.description,
      founder: { "@id": `${site.url}/#laraib` },
      employee: { "@id": `${site.url}/#laraib` },
      sameAs: [site.instagram],
      areaServed: "Worldwide (online)",
      availableLanguage: ["English"],
      medicalSpecialty: "Psychiatric",
      hasOfferCatalog: {
        "@type": "OfferCatalog",
        name: "Therapy services",
        itemListElement: focusAreas.map((f) => ({
          "@type": "Offer",
          itemOffered: { "@type": "Service", name: f.title, description: f.body },
        })),
      },
      potentialAction: {
        "@type": "CommunicateAction",
        name: "Request a free 15-minute consultation",
        target: `${site.url}/#book`,
      },
    },
    {
      "@type": "FAQPage",
      "@id": `${site.url}/#faq`,
      mainEntity: faqs.map((f) => ({
        "@type": "Question",
        name: f.q,
        acceptedAnswer: { "@type": "Answer", text: f.a },
      })),
    },
  ],
};
