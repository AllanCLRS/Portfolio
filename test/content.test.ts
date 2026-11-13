// @vitest-environment node
// Pure filesystem assertions - booting a Nuxt instance here costs ~10s and
// times out the setup hook for no benefit.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";
import { parse } from "yaml";

const projectRoot = join(dirname(fileURLToPath(import.meta.url)), "..");
const contentDir = join(projectRoot, "content");
const LOCALES = ["fr", "en"] as const;

const readYaml = (...segments: string[]) =>
  parse(readFileSync(join(contentDir, ...segments), "utf8"));

// A missing icon name renders as an empty box with no error anywhere, so the
// only way to catch a typo is to check it against the installed collections.
// Aliases count: Iconify resolves them transparently, so `building-2` (an alias
// of `building`) is a perfectly valid name. Checking only `icons` rejected them.
const loadCollection = (pkg: string): Set<string> => {
  const data = JSON.parse(
    readFileSync(join(projectRoot, "node_modules", "@iconify-json", pkg, "icons.json"), "utf8"),
  );

  return new Set([...Object.keys(data.icons ?? {}), ...Object.keys(data.aliases ?? {})]);
};

const collections: Record<string, Set<string>> = {
  "i-simple-icons-": loadCollection("simple-icons"),
  "i-lucide-": loadCollection("lucide"),
};

const iconExists = (name: string) => {
  const prefix = Object.keys(collections).find((p) => name.startsWith(p));
  return prefix ? collections[prefix]!.has(name.slice(prefix.length)) : false;
};

// These guard the data itself rather than the markup: the portfolio is only as
// good as the CV facts behind it, and a silently dropped entry is invisible.
describe.each(LOCALES)("content/%s/index.yml", (locale) => {
  const index = readYaml(locale, "index.yml");

  it("lists every school from the CV, newest first", () => {
    const schools = index.education.items.map((i: { school: string }) => i.school);

    expect(schools).toEqual([
      "ECAM Lyon A&M",
      "VSB TUO, Ostrava",
      "Aux Lazaristes, Lyon",
      "Lycée St Michel, St Étienne",
    ]);
  });

  it("lists every employer from the CV", () => {
    const companies = index.experience.items.map(
      (i: { company: { name: string } }) => i.company.name,
    );

    expect(companies).toContain("Maline Immobilier");
    expect(companies).toContain("Steamulo");
    expect(companies).toContain("Bosch Rexroth");
    expect(companies).toContain("Coveris & HEF");
  });

  it("covers four expertise areas", () => {
    expect(index.expertise.categories).toHaveLength(4);
  });

  it("keeps language levels within a renderable 0-100 range", () => {
    for (const language of index.languages.items) {
      expect(language.value).toBeGreaterThanOrEqual(0);
      expect(language.value).toBeLessThanOrEqual(100);
    }
  });

  it("splits the stack into three marquee groups", () => {
    expect(index.hero.stacks).toHaveLength(3);
  });

  it("resolves every stack icon against the installed collections", () => {
    for (const stack of index.hero.stacks) {
      for (const tech of stack.items) {
        expect(iconExists(tech.icon), `${tech.name}: ${tech.icon} not found`).toBe(true);
      }
    }
  });

  it("uses valid hex colours everywhere one is set", () => {
    const labelled: [string, string][] = [
      ...index.hero.stacks.flatMap((s: { items: { name: string; color?: string }[] }) =>
        s.items.filter((t) => t.color).map((t): [string, string] => [t.name, t.color!]),
      ),
      ...index.experience.items.map(
        (i: { company: { name: string; color: string } }): [string, string] => [
          i.company.name,
          i.company.color,
        ],
      ),
      ...index.education.items.map((i: { school: string; color: string }): [string, string] => [
        i.school,
        i.color,
      ]),
      ...index.expertise.categories.map((c: { title: string; color: string }): [string, string] => [
        c.title,
        c.color,
      ]),
      ...index.languages.items.map((i: { name: string; color: string }): [string, string] => [
        i.name,
        i.color,
      ]),
      ...index.engagements.items.map((i: { title: string; color: string }): [string, string] => [
        i.title,
        i.color,
      ]),
    ];

    // An invalid hex silently falls back to the inherited colour, so a typo
    // looks like "the colour did not apply" rather than an error.
    for (const [label, color] of labelled) {
      expect(color, label).toMatch(/^#[0-9A-Fa-f]{6}$/);
    }
  });

  it("colours every section rather than leaving it on the default primary", () => {
    // The point of these colours is variety: a section where every entry shares
    // one colour is the monochrome look they replaced.
    const sections: Record<string, string[]> = {
      education: index.education.items.map((i: { color: string }) => i.color),
      expertise: index.expertise.categories.map((c: { color: string }) => c.color),
      languages: index.languages.items.map((i: { color: string }) => i.color),
      engagements: index.engagements.items.map((i: { color: string }) => i.color),
    };

    for (const [section, colors] of Object.entries(sections)) {
      expect(new Set(colors).size, `${section} reuses a single colour`).toBeGreaterThan(1);
    }
  });

  it("only links schools out to absolute URLs", () => {
    // A relative value would resolve against the site and 404 instead of
    // reaching the school, which is invisible until someone clicks.
    for (const item of index.education.items.filter((i: { url?: string }) => i.url)) {
      expect(item.url, item.school).toMatch(/^https:\/\//);
    }
  });

  it("resolves every other icon in the file", () => {
    const icons = [
      ...index.experience.items.map((i: { company: { logo: string } }) => i.company.logo),
      ...index.education.items.map((i: { icon: string }) => i.icon),
      ...index.expertise.categories.map((c: { icon: string }) => c.icon),
      ...index.engagements.items.map((i: { icon: string }) => i.icon),
    ];

    for (const icon of icons) {
      expect(iconExists(icon), `${icon} not found`).toBe(true);
    }
  });
});

describe.each(LOCALES)("content/%s/projects", (locale) => {
  const files = readdirSync(join(contentDir, locale, "projects"));
  const projects = files.map((file) => readYaml(locale, "projects", file));

  it("has one file per CV mission", () => {
    expect(files).toHaveLength(6);
  });

  it("gives every project the fields the card needs", () => {
    for (const project of projects) {
      expect(project.title, "missing title").toBeTruthy();
      expect(project.client, `${project.title}: missing client`).toBeTruthy();
      expect(iconExists(project.icon), `${project.title}: ${project.icon} not found`).toBe(true);
      expect(project.color, `${project.title}: missing color`).toMatch(/^#/);
      expect(project.tags.length, `${project.title}: no tags`).toBeGreaterThan(0);
    }
  });

  it("only links out to absolute URLs", () => {
    for (const project of projects.filter((p) => p.url)) {
      expect(project.url, `${project.title}: relative url`).toMatch(/^https:\/\//);
    }
  });
});

// Translations drifting apart is the classic i18n bug: a key added to one
// locale and forgotten in the other renders as the raw key on screen.
describe("locale parity", () => {
  const flatten = (obj: Record<string, unknown>, prefix = ""): string[] =>
    Object.entries(obj).flatMap(([key, value]) =>
      value && typeof value === "object" && !Array.isArray(value)
        ? flatten(value as Record<string, unknown>, `${prefix}${key}.`)
        : [`${prefix}${key}`],
    );

  it("defines exactly the same message keys in every locale", () => {
    const keysByLocale = LOCALES.map((locale) =>
      flatten(
        JSON.parse(readFileSync(join(projectRoot, "i18n", "locales", `${locale}.json`), "utf8")),
      ).sort(),
    );

    expect(keysByLocale[1]).toEqual(keysByLocale[0]);
  });

  it("ships the same content files in every locale", () => {
    const treeByLocale = LOCALES.map((locale) =>
      [
        ...readdirSync(join(contentDir, locale)).filter((f) => f.endsWith(".yml")),
        ...readdirSync(join(contentDir, locale, "projects")).map((f) => `projects/${f}`),
      ].sort(),
    );

    expect(treeByLocale[1]).toEqual(treeByLocale[0]);
  });

  it("keeps structural values identical across locales", () => {
    const [fr, en] = LOCALES.map((l) => readYaml(l, "index.yml"));

    // Icons, colours and meter values are data, not copy - they must not drift.
    const shape = (index: typeof fr) => ({
      stackIcons: index.hero.stacks.flatMap((s: { items: { icon: string }[] }) =>
        s.items.map((i) => i.icon),
      ),
      languageValues: index.languages.items.map((i: { value: number }) => i.value),
      experienceLogos: index.experience.items.map(
        (i: { company: { logo: string } }) => i.company.logo,
      ),
      experienceColors: index.experience.items.map(
        (i: { company: { color: string } }) => i.company.color,
      ),
      educationColors: index.education.items.map((i: { color: string }) => i.color),
      // URLs are data, not copy: both locales must point at the same pages.
      educationUrls: index.education.items.map((i: { url?: string }) => i.url ?? null),
      expertiseColors: index.expertise.categories.map((c: { color: string }) => c.color),
      languageColors: index.languages.items.map((i: { color: string }) => i.color),
      engagementColors: index.engagements.items.map((i: { color: string }) => i.color),
    });

    expect(shape(en)).toEqual(shape(fr));
  });
});
