// @vitest-environment node
// Source-level guards. These cannot be caught by rendering a component: the
// bug they protect against only appears in the prerendered output.
import { readFileSync, readdirSync } from "node:fs";
import { fileURLToPath } from "node:url";
import { dirname, join } from "node:path";
import { describe, expect, it } from "vitest";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const pagesDir = join(root, "app", "pages");
const pages = readdirSync(pagesDir).filter((f) => f.endsWith(".vue"));

describe("app/pages", () => {
  it("has at least one page to check", () => {
    expect(pages.length).toBeGreaterThan(0);
  });

  // This shipped to production once: with a shared key such as "index", the
  // prerenderer populated the cache on whichever locale rendered first and
  // reused it for the other, so /en served French content. The key has to
  // carry the locale.
  it.each(pages)("scopes every useAsyncData key to the locale in %s", (file) => {
    const source = readFileSync(join(pagesDir, file), "utf8");

    // The key is the first argument of each useAsyncData( call.
    const keys = [...source.matchAll(/useAsyncData\(\s*(?:\/\/[^\n]*\n\s*)*([^,]+),/g)].map((m) =>
      m[1]!.trim(),
    );

    expect(keys.length, `${file}: no useAsyncData call found`).toBeGreaterThan(0);

    for (const key of keys) {
      expect(key, `${file}: key ${key} is shared across locales`).toContain("${locale.value}");
    }
  });
});

// The sitemap and robots.txt are generated from PUBLIC_PAGES. Adding a page
// under app/pages without listing it there would silently leave it out of the
// sitemap, which is exactly the kind of omission nobody notices.
describe("server/utils/routes", () => {
  it("lists every page in PUBLIC_PAGES", () => {
    const source = readFileSync(join(root, "server", "utils", "routes.ts"), "utf8");
    // Only the PUBLIC_PAGES array, not every string literal in the file.
    const array = /PUBLIC_PAGES\s*=\s*\[([^\]]*)\]/.exec(source)?.[1] ?? "";
    const listed = [...array.matchAll(/"([^"]*)"/g)].map((m) => m[1]!);

    const expected = pages.map((f) => (f === "index.vue" ? "" : `/${f.replace(/\.vue$/, "")}`));

    expect([...listed].sort()).toEqual([...expected].sort());
  });
});
