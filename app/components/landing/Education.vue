<script lang="ts">
import type { IndexPage } from "~/types/content";

interface EducationProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
const props = defineProps<EducationProps>();

// UTimeline expects `title`/`description`, so the CV fields are remapped.
const timelineItems = computed(() =>
  props.page.education.items.map((item) => ({
    date: item.date,
    title: item.degree,
    description: item.school,
    url: item.url,
    icon: item.icon,
    color: item.color,
  })),
);
</script>

<template>
  <UPageSection
    :title="page.education.title"
    :description="page.education.description"
    :ui="SECTION_UI"
  >
    <!-- No `default-value`: it marks entries as completed, which forces
         `bg-primary` on the indicator and would bury the per-item colour. -->
    <UTimeline :items="timelineItems" class="mt-6" :ui="{ date: 'text-muted' }">
      <template #indicator="{ item }">
        <UIcon :name="item.icon" class="size-4" :style="{ color: item.color }" />
      </template>

      <!-- `as="span"` makes one ULink cover both cases: an <a href> for the
           schools that have a page, a plain <span> for the others. -->
      <template #description="{ item }">
        <ULink
          as="span"
          :to="item.url"
          :target="item.url ? '_blank' : undefined"
          :class="
            item.url
              ? 'underline decoration-dotted underline-offset-4 transition-colors hover:text-highlighted'
              : undefined
          "
        >
          {{ item.description }}
        </ULink>
      </template>
    </UTimeline>
  </UPageSection>
</template>
