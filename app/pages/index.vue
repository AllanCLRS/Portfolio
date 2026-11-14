<script setup lang="ts">
const { t, locale } = useI18n();

const { data: page } = await useAsyncData(
  // The key must carry the locale: a shared key makes the prerenderer reuse
  // whichever locale rendered first for both routes, so /en served FR content.
  `index-${locale.value}`,
  // Cast to the `fr` key, not `keyof Collections`: every locale shares one
  // schema, so this keeps the precise document type instead of a union of all
  // collections, which would not satisfy the components’ props.
  () => queryCollection(`index_${locale.value}` as "index_fr").first(),
  // Without this the page keeps the previous locale's content after switching.
  { watch: [locale] },
);

if (!page.value) {
  throw createError({
    statusCode: 404,
    statusMessage: t("error.notFound"),
    fatal: true,
  });
}

useSeoMeta({
  title: () => page.value?.seo?.title || page.value?.title,
  ogTitle: () => page.value?.seo?.title || page.value?.title,
  description: () => page.value?.seo?.description || page.value?.description,
  ogDescription: () => page.value?.seo?.description || page.value?.description,
});

// Only on the home page: it is where the data describing Allan actually lives,
// and where search engines expect the site's Person entity to be declared.
useStructuredData(page);
</script>

<template>
  <UPage v-if="page">
    <LandingHero :page />
    <UPageSection
      :ui="{
        container: 'pt-0! lg:grid lg:grid-cols-2 lg:gap-8',
      }"
    >
      <LandingAbout :page />
      <LandingWorkExperience :page />
    </UPageSection>
    <LandingEducation :page />
    <LandingExpertise :page />
    <LandingLanguages :page />
    <LandingEngagements :page />
  </UPage>
</template>
