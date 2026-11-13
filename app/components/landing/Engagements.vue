<script lang="ts">
import type { IndexPage } from "~/types/content";

interface EngagementsProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
defineProps<EngagementsProps>();
</script>

<template>
  <UPageSection
    :title="page.engagements.title"
    :description="page.engagements.description"
    :ui="SECTION_UI"
  >
    <div class="mt-6 grid gap-4 sm:grid-cols-2">
      <Motion
        v-for="(item, index) in page.engagements.items"
        :key="item.title"
        v-bind="RISE_IN"
        :transition="{ delay: 0.1 * index }"
      >
        <!-- The leading icon is `text-primary`, which resolves from
             --ui-primary, so redefining it inline recolours just this card. -->
        <UPageCard
          :title="item.title"
          :description="item.description"
          :icon="item.icon"
          variant="subtle"
          class="h-full"
          :style="{ '--ui-primary': item.color }"
        />
      </Motion>
    </div>
  </UPageSection>
</template>
