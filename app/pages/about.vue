<script setup lang="ts">
const { t, locale } = useI18n();
const { global } = useAppConfig();

const { data: page } = await useAsyncData(
  "about",
  // Cast to the `fr` key, not `keyof Collections`: every locale shares one
  // schema, so this keeps the precise document type instead of a union of all
  // collections, which would not satisfy the components’ props.
  () => queryCollection(`about_${locale.value}` as "about_fr").first(),
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
</script>

<template>
  <UPage v-if="page">
    <UPageHero
      :title="page.title"
      :description="page.description"
      orientation="horizontal"
      :ui="{
        container: 'lg:flex sm:flex-row items-center',
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start',
      }"
    >
      <UAvatar
        :src="global.picture?.src || undefined"
        :alt="global.picture?.alt"
        text="AC"
        class="sm:rotate-4 size-36 rounded-lg ring ring-default ring-offset-3 ring-offset-bg"
      />
    </UPageHero>

    <UPageSection :ui="{ container: 'pt-0!' }">
      <MDC :value="page.content" unwrap="p" class="prose dark:prose-invert" />
    </UPageSection>
  </UPage>
</template>
