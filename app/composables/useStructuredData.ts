import type { IndexPage } from "~/types/content";

/**
 * The subset of schema.org we emit. Typing these rather than building loose
 * object literals means a renamed content field or a misspelled schema key
 * fails the typecheck instead of silently shipping invalid structured data,
 * which search engines reject without telling anyone.
 */
interface SchemaOrganization {
  "@type": "Organization" | "EducationalOrganization";
  name: string;
  url?: string;
}

interface SchemaPerson {
  "@type": "Person";
  "@id": string;
  name: string;
  url: string;
  image: string;
  email: string;
  jobTitle: string;
  description: string;
  sameAs: string[];
  address: {
    "@type": "PostalAddress";
    addressLocality: string;
    addressCountry: string;
  };
  worksFor?: SchemaOrganization;
  alumniOf: SchemaOrganization[];
  knowsAbout: string[];
  knowsLanguage: { "@type": "Language"; name: string }[];
}

interface SchemaWebSite {
  "@type": "WebSite";
  "@id": string;
  url: string;
  name: string;
  inLanguage: string;
  publisher: { "@id": string };
}

interface SchemaGraph {
  "@context": "https://schema.org";
  "@graph": [SchemaPerson, SchemaWebSite];
}

/**
 * JSON-LD for the home page: a Person describing Allan, plus the WebSite it
 * belongs to.
 *
 * Every field is derived from the content files rather than written by hand.
 * Structured data that disagrees with what the page shows is worse than none
 * at all — search engines treat the mismatch as a quality signal against the
 * site — so the schools, skills, languages and employers below are exactly the
 * ones rendered on screen, in the active locale.
 */
// `useAsyncData` yields `T | null | undefined`, so accept all three.
export const useStructuredData = (page: Ref<IndexPage | null | undefined>) => {
  const { locale } = useI18n();
  const { global } = useAppConfig();
  const socialLinks = useSocialLinks();
  const site = useRuntimeConfig().public.siteUrl.replace(/\/$/, "");

  const localeHome = computed(() => (locale.value === "fr" ? site : `${site}/en`));

  const graph = computed<SchemaGraph | null>(() => {
    const data = page.value;
    if (!data) return null;

    // mailto: is not a profile, so it does not belong in sameAs.
    const profiles = socialLinks.value
      .map((link) => String(link.to ?? ""))
      .filter((url) => url.startsWith("http"));

    const person: SchemaPerson = {
      "@type": "Person",
      "@id": `${site}/#allan`,
      name: "Allan Clarissou",
      url: localeHome.value,
      image: `${site}${global.picture?.src}`,
      email: `mailto:${global.email}`,
      jobTitle: data.seo?.title ?? data.title,
      description: data.seo?.description ?? data.description,
      sameAs: profiles,
      address: {
        "@type": "PostalAddress",
        addressLocality: "Lyon",
        addressCountry: "FR",
      },
      // The most recent entry is the current employer.
      worksFor: data.experience.items[0]
        ? {
            "@type": "Organization",
            name: data.experience.items[0].company.name,
            ...(data.experience.items[0].company.url
              ? { url: data.experience.items[0].company.url }
              : {}),
          }
        : undefined,
      alumniOf: data.education.items.map((item) => ({
        "@type": "EducationalOrganization",
        name: item.school,
        ...(item.url ? { url: item.url } : {}),
      })),
      knowsAbout: data.expertise.categories.flatMap((category) => category.skills),
      knowsLanguage: data.languages.items.map((language) => ({
        "@type": "Language",
        name: language.name,
      })),
    };

    const website: SchemaWebSite = {
      "@type": "WebSite",
      "@id": `${site}/#website`,
      url: site,
      name: "Allan Clarissou",
      inLanguage: locale.value === "fr" ? "fr-FR" : "en-US",
      publisher: { "@id": `${site}/#allan` },
    };

    return { "@context": "https://schema.org", "@graph": [person, website] };
  });

  useHead(() => ({
    script: graph.value
      ? [
          {
            type: "application/ld+json",
            // JSON.stringify drops the `undefined` worksFor when there is none.
            innerHTML: JSON.stringify(graph.value),
          },
        ]
      : [],
  }));
};
