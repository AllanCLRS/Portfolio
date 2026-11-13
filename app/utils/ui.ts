/**
 * Shared heading treatment for the landing sections.
 *
 * Deliberately applied per instance via `:ui` rather than hoisted into
 * app.config: slots set there are merged at the base level, so the component's
 * own variant classes (`orientation: vertical` sets `text-center`) are applied
 * afterwards and win. A per-instance `:ui` is applied last and actually sticks.
 */
export const SECTION_UI = {
  container: "pt-0!",
  title: "text-left text-xl sm:text-xl lg:text-2xl font-medium",
  description: "text-left mt-2 text-sm text-muted",
} as const;
