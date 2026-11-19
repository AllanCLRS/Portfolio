<script lang="ts">
import type { IndexPage } from "~/types/content";

interface HeroProps {
  page: IndexPage;
}
</script>

<script setup lang="ts">
const { t } = useI18n();
const { global } = useAppConfig();
const socialLinks = useSocialLinks();

defineProps<HeroProps>();
</script>

<template>
  <UPageHero
    :ui="{
      headline: 'flex items-center justify-center',
      title: 'text-shadow-md max-w-2xl mx-auto',
      links: 'mt-4 flex-col justify-center items-center',
    }"
  >
    <template #headline>
      <Motion v-bind="FADE_IN" :transition="{ duration: 0.6, delay: 0.1 }">
        <UAvatar
          :src="global.picture?.src || undefined"
          :alt="global.picture?.alt"
          text="AC"
          class="size-60"
        />
      </Motion>
    </template>

    <template #title>
      <Motion v-bind="FADE_IN" :transition="{ duration: 0.6, delay: 0.1 }">
        {{ page.title }}
      </Motion>
    </template>

    <template #description>
      <Motion v-bind="FADE_IN" :transition="{ duration: 0.6, delay: 0.3 }">
        {{ page.description }}
      </Motion>
    </template>

    <template #links>
      <Motion v-bind="FADE_IN" :transition="{ duration: 0.6, delay: 0.5 }">
        <div v-if="page.hero.links" class="flex flex-col items-center sm:flex-row gap-2">
          <UButton v-bind="page.hero.links[0]" :to="`mailto:${global.email}`" />
          <UButton
            :color="global.available ? 'success' : 'error'"
            variant="ghost"
            class="gap-2"
            :class="global.available ? 'text-green-800 dark:text-green-400' : undefined"
            :label="global.available ? t('hero.available') : t('hero.unavailable')"
            :to="global.available ? `mailto:${global.email}` : undefined"
          >
            <template #leading>
              <span class="relative flex size-2">
                <span
                  class="absolute inline-flex size-full rounded-full opacity-75"
                  :class="global.available ? 'bg-success animate-ping' : 'bg-error'"
                />
                <span
                  class="relative inline-flex size-2 scale-90 rounded-full"
                  :class="global.available ? 'bg-success' : 'bg-error'"
                />
              </span>
            </template>
          </UButton>
        </div>
      </Motion>

      <div class="gap-x-4 inline-flex mt-4">
        <Motion
          v-for="(link, index) of socialLinks"
          :key="index"
          v-bind="FADE_IN"
          :transition="{ duration: 0.6, delay: 0.5 + index * 0.1 }"
        >
          <UButton v-bind="{ size: 'md', color: 'neutral', variant: 'ghost', ...link }" />
        </Motion>
      </div>
    </template>

    <!-- min-w-0 is load-bearing: UPageHero's container is a grid at lg, and a
         grid item defaults to min-width:auto, so without it this wrapper
         refuses to shrink below the marquee's min-content width (~12000px)
         and the whole page scrolls sideways. -->
    <div class="flex min-w-0 flex-col gap-2 py-2">
      <LandingStackMarquee
        v-for="(stack, index) in page.hero.stacks"
        :key="stack.title"
        :stack="stack"
        :reverse="index % 2 === 0"
      />
    </div>
  </UPageHero>
</template>
