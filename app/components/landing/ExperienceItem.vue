<script lang="ts">
import type { Experience } from "~/types/content";

interface ExperienceItemProps {
  experience: Experience;
  /** Drives the stagger delay so rows fade in one after another. */
  index: number;
}
</script>

<script setup lang="ts">
defineProps<ExperienceItemProps>();
</script>

<template>
  <Motion
    v-bind="RISE_IN"
    :transition="{ delay: 0.1 * index }"
    class="text-muted flex items-center gap-4"
  >
    <p class="text-sm text-start shrink-0 tabular-nums">
      {{ experience.date }}
    </p>
    <USeparator class="hidden sm:block" />

    <!-- `as="span"` makes one ULink cover both cases: an <a href> when the
         company has a URL, a plain <span> when it does not. -->
    <ULink
      as="span"
      :to="experience.company.url"
      :target="experience.company.url ? '_blank' : undefined"
      class="flex flex-col items-center gap-x-1 border min-w-50 p-1"
      :style="{ borderColor: experience.company.color }"
    >
      <span class="text-sm">{{ experience.position }}</span>
      <span class="inline-flex items-center gap-2" :style="{ color: experience.company.color }">
        <span class="font-medium">{{ experience.company.name }}</span>
        <UIcon :name="experience.company.logo" class="shrink-0" />
      </span>
    </ULink>
  </Motion>
</template>
