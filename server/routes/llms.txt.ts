// Imported explicitly: the auto-import is typed as the client queryCollection
// (no event argument), which collapses every result into a union of all
// collections. The nitro entry is the same function with the server signature.
import { queryCollection } from "@nuxt/content/nitro";
import { localisedRoutes } from "../utils/routes";

/**
 * llms.txt (https://llmstxt.org): a plain Markdown summary of the site for
 * language models and AI agents, which otherwise have to guess the content
 * from HTML, navigation and scripts.
 *
 * Built from the same content files as the pages, so a new project or an
 * edited bio shows up here without touching this file. Written in French, the
 * default locale; the English pages are listed under "Optional".
 * Prerendered, so it ships as a static file like sitemap.xml.
 */
export default defineEventHandler(async (event) => {
  const site = useRuntimeConfig(event).public.siteUrl.replace(/\/$/, "");
  const { email } = useAppConfig().global;
  const abs = (path: string) => `${site}${path === "/" ? "" : path}`;

  const [home, about, projectsPage, projects] = await Promise.all([
    queryCollection(event, "index_fr").first(),
    queryCollection(event, "about_fr").first(),
    queryCollection(event, "pages_fr").first(),
    queryCollection(event, "projects_fr").order("date", "DESC").all(),
  ]);

  if (!home || !about || !projectsPage) {
    throw createError({ statusCode: 500, statusMessage: "llms.txt: missing content" });
  }

  const [homeRoute, projectsRoute, aboutRoute] = localisedRoutes();
  const oneLine = (text: string) => text.replace(/\s+/g, " ").trim();

  const projectLines = projects.map((p) => {
    const meta = [p.client, p.duration, p.tags.join(", ")].filter(Boolean).join(" · ");
    const title = p.url ? `[${p.title}](${p.url})` : p.title;
    return `- ${title} (${meta}): ${oneLine(p.description)}`;
  });

  const body = `# Allan Clarissou

> ${oneLine(home.seo?.description || home.description)}

${oneLine(about.description)}

Contact : ${email} · LinkedIn : https://www.linkedin.com/in/allan-clarissou-ecam · GitHub : https://github.com/AllanCLRS

## Pages

- [Accueil](${abs(homeRoute!.fr)}): ${oneLine(home.description)}
- [Projets](${abs(projectsRoute!.fr)}): ${oneLine(projectsPage.description)}
- [À propos](${abs(aboutRoute!.fr)}): parcours, compétences et engagements

## Projets

${projectLines.join("\n")}

## Optional

- [Home (English)](${abs(homeRoute!.en)}): same content in English
- [Projects (English)](${abs(projectsRoute!.en)})
- [About (English)](${abs(aboutRoute!.en)})
`;

  setHeader(event, "content-type", "text/plain; charset=utf-8");
  return body;
});
