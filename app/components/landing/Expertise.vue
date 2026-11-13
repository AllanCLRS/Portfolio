<script lang="ts">
import type { IndexPage } from "~/types/content";

interface ExpertiseProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
defineProps<ExpertiseProps>();
</script>

<template>
  <UPageSection
    :title="page.expertise.title"
    :description="page.expertise.description"
    :ui="SECTION_UI"
  >
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <Motion
        v-for="(category, index) in page.expertise.categories"
        :key="category.title"
        v-bind="RISE_IN"
        :transition="{ delay: 0.1 * index }"
      >
        <UCard variant="subtle" class="h-full">
          <template #header>
            <div class="flex items-center gap-2">
              <UIcon :name="category.icon" class="size-5" :style="{ color: category.color }" />
              <h3 class="font-medium">{{ category.title }}</h3>
            </div>
          </template>

          <div class="flex flex-wrap gap-2">
            <UBadge
              v-for="skill in category.skills"
              :key="skill"
              :label="skill"
              color="neutral"
              variant="subtle"
            />
          </div>
        </UCard>
      </Motion>
    </div>
  </UPageSection>
</template>
