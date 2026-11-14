// https://nuxt.com/docs/api/configuration/nuxt-config

// hreflang and canonical links must be absolute to be usable by search
// engines; without a baseUrl, @nuxtjs/i18n emits relative paths and warns.
// Overridable per environment so a custom domain needs no code change.
const SITE_URL = process.env.NUXT_PUBLIC_SITE_URL ?? "https://allan-clarissou-portfolio.vercel.app";

export default defineNuxtConfig({
  compatibilityDate: "2025-07-15",
  devtools: { enabled: true },
  modules: ["@nuxt/ui", "@nuxt/content", "@nuxtjs/i18n", "motion-v/nuxt"],
  content: {
    experimental: {
      sqliteConnector: "native",
    },
  },
  i18n: {
    baseUrl: SITE_URL,
    // French is the default and stays unprefixed (/), English lives under /en.
    defaultLocale: "fr",
    strategy: "prefix_except_default",
    locales: [
      { code: "fr", name: "Français", language: "fr-FR", file: "fr.json" },
      { code: "en", name: "English", language: "en-US", file: "en.json" },
    ],
    detectBrowserLanguage: {
      useCookie: true,
      cookieKey: "i18n_locale",
      // Without this, a first-time visitor is redirected away from whichever
      // URL they were sent, which breaks shared links.
      redirectOn: "root",
    },
  },
  runtimeConfig: {
    public: {
      siteUrl: SITE_URL,
    },
  },
  typescript: {
    // Dev only. Running vue-tsc inside the production build doubles its peak
    // memory, and a 2-core/8 GB build machine kills the process without a
    // readable error. Types are already gated by the pre-commit hook and by
    // `pnpm typecheck`, so the build gains nothing by checking them again.
    typeCheck: process.env.NODE_ENV !== "production",
  },
  css: ["~/assets/css/main.css"],
  // The whole site is content-driven and has no dynamic routes, so every page
  // can be rendered at build time and served as static HTML.
  nitro: {
    prerender: {
      routes: ["/", "/en", "/sitemap.xml", "/robots.txt"],
      crawlLinks: true,
    },
  },
});
