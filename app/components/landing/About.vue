<script lang="ts">
import type { IndexPage } from "~/types/content";

interface AboutProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
defineProps<AboutProps>();
</script>

<template>
  <UPageSection
    :title="page.about.title"
    :description="page.about.description"
    :ui="{
      ...SECTION_UI,
      container: 'p-0!',
      description: 'text-left mt-3 text-sm sm:text-base lg:text-sm text-muted whitespace-pre-line',
    }"
  />
</template>
