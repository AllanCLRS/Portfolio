<script setup lang="ts">
const { t, locale } = useI18n();
const { global } = useAppConfig();

const { data: page } = await useAsyncData(
  "projects-page",
  // No `.path()` filter: sourcing from a locale folder makes Content compute
  // the path as `/fr`, not `/projects`. The collection holds exactly one
  // document per locale, so `.first()` is unambiguous and path-independent.
  // Cast to the `fr` key, not `keyof Collections`: every locale shares one
  // schema, so this keeps the precise document type instead of a union of all
  // collections, which would not satisfy the components’ props.
  () => queryCollection(`pages_${locale.value}` as "pages_fr").first(),
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

const { data: projects } = await useAsyncData(
  "projects",
  () =>
    queryCollection(`projects_${locale.value}` as "projects_fr")
      .order("date", "DESC")
      .all(),
  { watch: [locale] },
);

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
      :ui="{
        title: 'mx-0! text-left',
        description: 'mx-0! text-left',
        links: 'justify-start',
      }"
    >
      <template #links>
        <div v-if="page.links" class="flex items-center gap-2">
          <UButton v-bind="page.links[0]" :to="`mailto:${global.email}`" />
          <UButton v-bind="page.links[1]" />
        </div>
      </template>
    </UPageHero>

    <UPageSection
      :ui="{
        container: 'pt-0! flex flex-col gap-10',
      }"
    >
      <Motion
        v-for="(project, index) in projects"
        :key="project.title"
        :initial="{ opacity: 0, transform: 'translateY(10px)' }"
        :while-in-view="{ opacity: 1, transform: 'translateY(0)' }"
        :transition="{ delay: 0.1 * index }"
        :in-view-options="{ once: true }"
      >
        <UPageCard
          :title="project.title"
          :to="project.url"
          :target="project.url ? '_blank' : undefined"
          orientation="horizontal"
          variant="naked"
          :reverse="index % 2 === 1"
          class="group"
          :ui="{ wrapper: 'max-sm:order-last' }"
        >
          <template #leading>
            <div class="flex items-center gap-2 text-sm text-muted">
              <span class="tabular-nums">
                {{ new Date(project.date).getFullYear() }}
              </span>
              <template v-if="project.duration">
                <span>•</span>
                <span>{{ project.duration }}</span>
              </template>
            </div>
          </template>

          <template #description>
            <p class="text-muted">{{ project.description }}</p>

            <ul v-if="project.highlights?.length" class="mt-4 flex flex-col gap-1.5">
              <li
                v-for="highlight in project.highlights"
                :key="highlight"
                class="flex items-start gap-2 text-sm text-muted"
              >
                <UIcon name="i-lucide-check" class="mt-0.5 size-4 shrink-0 text-primary" />
                <span>{{ highlight }}</span>
              </li>
            </ul>

            <div class="mt-4 flex flex-wrap gap-2">
              <UBadge
                v-for="tag in project.tags"
                :key="tag"
                :label="tag"
                color="neutral"
                variant="subtle"
                size="sm"
              />
            </div>
          </template>

          <template #footer>
            <ULink
              v-if="project.url"
              :to="project.url"
              target="_blank"
              class="text-sm text-primary flex items-center"
            >
              {{ t("projects.view") }}
              <UIcon
                name="i-lucide-arrow-right"
                class="size-4 text-primary transition-all opacity-0 group-hover:translate-x-1 group-hover:opacity-100"
              />
            </ULink>
          </template>

          <!-- No screenshots for client work, so the tile carries the project
               identity through its icon and brand colour instead. -->
          <img
            v-if="project.image"
            :src="project.image"
            :alt="project.title"
            class="object-cover w-full h-48 rounded-lg"
          />
          <div
            v-else
            class="flex h-48 w-full flex-col items-center justify-center gap-3 rounded-lg border border-default"
            :style="{
              background: `linear-gradient(135deg, ${project.color}1a, ${project.color}05)`,
            }"
          >
            <UIcon :name="project.icon" class="size-10" :style="{ color: project.color }" />
            <span class="px-4 text-center text-sm font-medium text-muted">
              {{ project.client }}
            </span>
          </div>
        </UPageCard>
      </Motion>
    </UPageSection>
  </UPage>
</template>
