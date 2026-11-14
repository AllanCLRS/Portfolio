/**
 * Generated rather than kept in public/ so the Sitemap line, which must be an
 * absolute URL, follows runtimeConfig instead of being frozen in a file.
 */
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");

  setHeader(event, "content-type", "text/plain; charset=utf-8");

  return `User-Agent: *
Disallow:

Sitemap: ${site}/sitemap.xml
`;
});
