<script lang="ts">
import type { Stack } from "~/types/content";

interface StackMarqueeProps {
  stack: Stack;
  /** Scrolls right-to-left when true; alternated per row by the caller. */
  reverse?: boolean;
}
</script>

<script setup lang="ts">
withDefaults(defineProps<StackMarqueeProps>(), { reverse: false });
</script>

<template>
  <!-- The negative margins must mirror UContainer's px-4 sm:px-6 lg:px-8
       exactly: any larger and the row runs past the viewport, which makes the
       whole page scroll sideways. -->
  <UMarquee
    :reverse="reverse"
    pause-on-hover
    :ui="{ root: 'py-0' }"
    class="-mx-4 sm:-mx-6 lg:-mx-8 [--duration:40s]"
    :aria-label="stack.title"
  >
    <Motion
      v-for="(tech, index) in stack.items"
      :key="tech.name"
      v-bind="FADE_IN"
      :transition="{ duration: 0.6, delay: index * 0.05 }"
    >
      <div
        class="flex items-center gap-2 rounded-full border border-default bg-elevated/50 px-4 py-2 whitespace-nowrap"
      >
        <UIcon
          :name="tech.icon"
          class="size-5 shrink-0"
          :style="tech.color ? { color: tech.color } : undefined"
        />
        <span class="text-sm font-medium">{{ tech.name }}</span>
      </div>
    </Motion>
  </UMarquee>
</template>
