// Config for the Vite+ toolchain (`vp lint`, `vp fmt`, `vp test`).
// Nuxt does not read this file and will warn that it is unsupported - that is
// expected. Build/dev options belong in `nuxt.config.ts` under the `vite` key.
// Imported from `vite-plus` rather than `vite`: the pnpm override only rewrites
// `vite` for packages that declare it, so the bare specifier does not resolve
// from the project root.
import { defineConfig } from "vite-plus";

const generated = [
  ".nuxt/**",
  ".output/**",
  ".nitro/**",
  ".data/**",
  "dist/**",
  "public/**",
  ".backup-pre-viteplus/**",
];

export default defineConfig({
  lint: {
    ignorePatterns: generated,
  },
  // Run on staged files by the pre-commit hook (see .vite-hooks/pre-commit).
  staged: {
    "*": "vp check --fix",
  },
  fmt: {
    ignorePatterns: [...generated, "pnpm-lock.yaml"],
  },
});
