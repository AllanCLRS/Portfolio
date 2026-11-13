// Nuxt needs its own Vitest config rather than a `test` block in vite.config.ts:
// the `nuxt` environment has to boot a real Nuxt instance, which the Vite+
// built-in `vp test` config cannot provide. Run it with `vpr test` / `pnpm test`.
import { defineVitestConfig } from "@nuxt/test-utils/config";

export default defineVitestConfig({
  test: {
    environment: "nuxt",
    include: ["test/**/*.{test,spec}.ts"],
  },
});
