<script setup lang="ts">
const { footer } = useAppConfig();
const socialLinks = useSocialLinks();
</script>

<template>
  <UFooter class="z-10 bg-default" :ui="{ left: 'text-muted text-xs' }">
    <template #left>
      {{ footer.credits }}
    </template>

    <template #right>
      <UButton
        v-for="(link, index) of socialLinks"
        :key="index"
        v-bind="{ size: 'xs', color: 'neutral', variant: 'ghost', ...link }"
      />
    </template>
  </UFooter>
</template>
