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

const siteUrl = useRuntimeConfig().public.siteUrl;

// Defaults for the whole site. Pages override title/description; Twitter falls
// back to the og:* values, so only the image is worth declaring twice.
useSeoMeta({
  titleTemplate: "%s - Allan Clarissou",
  ogSiteName: "Allan Clarissou",
  ogType: "website",
  ogImage: `${siteUrl}/og-image.jpg`,
  ogImageWidth: 1200,
  ogImageHeight: 630,
  ogImageAlt: "Allan Clarissou — Ingénieur logiciel fullstack",
  twitterCard: "summary_large_image",
  twitterImage: `${siteUrl}/og-image.jpg`,
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
