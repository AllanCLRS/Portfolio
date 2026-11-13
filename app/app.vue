<script setup lang="ts">
const colorMode = useColorMode();
// Emits <html lang>, hreflang alternates and canonical for the active locale.
const head = useLocaleHead();

const color = computed(() => (colorMode.value === "dark" ? "#020618" : "white"));

useHead(() => ({
  htmlAttrs: head.value.htmlAttrs,
  link: [...(head.value.link ?? []), { rel: "icon", href: "/favicon.ico" }],
  meta: [
    ...(head.value.meta ?? []),
    { charset: "utf-8" },
    { name: "viewport", content: "width=device-width, initial-scale=1" },
    { key: "theme-color", name: "theme-color", content: color.value },
  ],
}));

useSeoMeta({
  titleTemplate: "%s - Allan Clarissou",
  twitterCard: "summary_large_image",
});
</script>

<template>
  <UApp>
    <NuxtLayout>
      <UMain class="relative">
        <NuxtPage />
      </UMain>
    </NuxtLayout>
  </UApp>
</template>
