<script lang="ts">
import type { IndexPage } from "~/types/content";

interface WorkExperienceProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
defineProps<WorkExperienceProps>();
</script>

<template>
  <UPageSection
    :title="page.experience.title"
    :ui="{ ...SECTION_UI, container: 'p-0! gap-4 sm:gap-4', description: 'mt-2' }"
  >
    <template #description>
      <div class="flex flex-col gap-4">
        <LandingExperienceItem
          v-for="(experience, index) in page.experience.items"
          :key="index"
          :experience
          :index
        />
      </div>
    </template>
  </UPageSection>
</template>
