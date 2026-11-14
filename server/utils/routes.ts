/**
 * The site's public routes, as locale pairs. Both sitemap.xml and robots.txt
 * are generated from this, so adding a page means touching one list.
 *
 * `fr` is the default locale and stays unprefixed; `en` lives under /en.
 */
export const PUBLIC_PAGES = ["", "/projects", "/about"] as const;

export interface LocalisedRoute {
  fr: string;
  en: string;
}

export const localisedRoutes = (): LocalisedRoute[] =>
  PUBLIC_PAGES.map((page) => ({
    fr: page === "" ? "/" : page,
    en: `/en${page}`,
  }));
