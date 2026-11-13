/**
 * Shared motion presets. Callers spread these with `v-bind` and pass their own
 * `:transition` for the stagger delay, which is the only part that varies.
 */

/** Hero elements blur into place once, on load. */
export const FADE_IN = {
  initial: { scale: 1.1, opacity: 0, filter: "blur(20px)" },
  animate: { scale: 1, opacity: 1, filter: "blur(0px)" },
} as const;

/** Section content rises into view as the reader reaches it, and stays put. */
export const RISE_IN = {
  initial: { opacity: 0, transform: "translateY(20px)" },
  whileInView: { opacity: 1, transform: "translateY(0)" },
  inViewOptions: { once: true },
} as const;
