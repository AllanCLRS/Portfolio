// https://nuxt.com/docs/api/configuration/nuxt-config
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
  typescript: {
    typeCheck: true,
  },
  css: ["~/assets/css/main.css"],
  // The whole site is content-driven and has no dynamic routes, so every page
  // can be rendered at build time and served as static HTML.
  nitro: {
    prerender: {
      routes: ["/", "/en"],
      crawlLinks: true,
    },
  },
});
