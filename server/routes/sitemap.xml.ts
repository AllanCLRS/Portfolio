import { localisedRoutes } from "../utils/routes";

/**
 * Hand-rolled rather than pulling in a sitemap module: the site has six fixed
 * routes, so a module would be a dependency for twenty lines of XML.
 * Prerendered, so it ships as a static file and still reads runtimeConfig.
 */
export default defineEventHandler((event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");
  const abs = (path: string) => `${site}${path === "/" ? "" : path}`;

  const urls = localisedRoutes()
    .flatMap(({ fr, en }) =>
      // Each language gets its own <url>, and both declare the same set of
      // alternates — that is what search engines expect.
      [fr, en].map(
        (self) => `  <url>
    <loc>${abs(self)}</loc>
    <xhtml:link rel="alternate" hreflang="fr" href="${abs(fr)}" />
    <xhtml:link rel="alternate" hreflang="en" href="${abs(en)}" />
    <xhtml:link rel="alternate" hreflang="x-default" href="${abs(fr)}" />
  </url>`,
      ),
    )
    .join("\n");

  setHeader(event, "content-type", "application/xml; charset=utf-8");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls}
</urlset>
`;
});
