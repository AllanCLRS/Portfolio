<script lang="ts">
import type { IndexPage } from "~/types/content";

interface LanguagesProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
defineProps<LanguagesProps>();
</script>

<template>
  <UPageSection
    :title="page.languages.title"
    :description="page.languages.description"
    :ui="SECTION_UI"
  >
    <div class="mt-6 flex flex-col gap-4">
      <Motion
        v-for="(language, index) in page.languages.items"
        :key="language.name"
        v-bind="RISE_IN"
        :transition="{ delay: 0.1 * index }"
      >
        <div class="flex items-center justify-between text-sm">
          <span class="font-medium">{{ language.name }}</span>
          <span class="text-muted">{{ language.level }}</span>
        </div>
        <UProgress
          :model-value="language.value"
          size="sm"
          class="mt-2"
          :style="{ '--ui-primary': language.color }"
          :aria-label="`${language.name} : ${language.level}`"
        />
      </Motion>
    </div>
  </UPageSection>
</template>
