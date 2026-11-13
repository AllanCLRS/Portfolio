import type { NavigationMenuItem } from "@nuxt/ui";

/**
 * Nav items have to be computed rather than a module constant: the labels come
 * from the active locale and the hrefs need its prefix (/projects vs /en/projects).
 */
export const useNavLinks = () => {
  const { t } = useI18n();
  const localePath = useLocalePath();

  return computed<NavigationMenuItem[]>(() => [
    {
      label: t("nav.home"),
      icon: "i-lucide-house",
      to: localePath("/"),
    },
    {
      label: t("nav.projects"),
      icon: "i-lucide-folder",
      to: localePath("/projects"),
    },
    {
      label: t("nav.about"),
      icon: "i-lucide-user",
      to: localePath("/about"),
    },
  ]);
};
