<script lang="ts">
import type { DropdownMenuItem } from "@nuxt/ui";
</script>

<script setup lang="ts">
const { t, locale, locales, setLocale } = useI18n();

// Deliberately NOT `to: switchLocalePath(code)`. The computed resolves the
// right paths, but the rendered links come back re-localized into the *current*
// locale (/about turns into /en/about while on English), so every entry pointed
// at the page you were already on. `setLocale` performs the switch and the
// navigation itself, which is immune to that rewriting.
// SEO still gets proper alternates: useLocaleHead emits the hreflang links.
const items = computed<DropdownMenuItem[]>(() =>
  locales.value.map((l) => ({
    label: l.name ?? l.code,
    trailingIcon: l.code === locale.value ? "i-lucide-check" : undefined,
    onSelect: () => {
      setLocale(l.code);
    },
  })),
);
</script>

<template>
  <UDropdownMenu :items="items">
    <UButton
      icon="i-lucide-languages"
      color="neutral"
      variant="ghost"
      size="sm"
      :aria-label="t('a11y.switchLanguage')"
    />
  </UDropdownMenu>
</template>
