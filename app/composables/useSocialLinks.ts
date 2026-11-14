import type { ButtonProps } from "@nuxt/ui";

/**
 * Social links live here rather than in app.config so their aria-labels can be
 * translated - app.config is evaluated once, outside any locale context.
 */
export const useSocialLinks = () => {
  const { t } = useI18n();
  const { global } = useAppConfig();

  return computed<ButtonProps[]>(() => [
    {
      icon: "i-simple-icons-linkedin",
      to: "https://www.linkedin.com/in/allan-clarissou-ecam",
      target: "_blank",
      "aria-label": t("a11y.linkedin"),
    },
    {
      icon: "i-simple-icons-github",
      to: "https://github.com/AllanCLRS",
      target: "_blank",
      "aria-label": t("a11y.github"),
    },
    {
      icon: "i-lucide-mail",
      to: `mailto:${global.email}`,
      "aria-label": t("a11y.email"),
    },
  ]);
};
