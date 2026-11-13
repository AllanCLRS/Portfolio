<script lang="ts">
import type { NavigationMenuItem } from "@nuxt/ui";

interface AppHeaderProps {
  links: NavigationMenuItem[];
}
</script>

<script setup lang="ts">
defineProps<AppHeaderProps>();
</script>

<template>
  <!-- `sticky`, not `fixed`, on purpose. A fixed element is positioned against
       the viewport, while the page content is centred by UContainer inside the
       body. Opening any overlay makes Reka UI lock body scroll, which removes
       the scrollbar (widening the viewport) and compensates with padding on the
       body - so the two reference frames diverge and a viewport-centred header
       drifts. Sticky keeps the header in the content's own frame, so it moves
       with the container instead of against it, whatever the scrollbar width. -->
  <div class="sticky top-2 sm:top-4 z-10 flex justify-center pointer-events-none">
    <UNavigationMenu
      :items="links"
      variant="link"
      color="neutral"
      class="pointer-events-auto w-auto bg-muted/80 backdrop-blur-sm rounded-full px-2 sm:px-4 border border-muted/50 shadow-lg shadow-neutral-950/5"
      :ui="{
        link: 'px-2 py-1',
        linkLeadingIcon: 'hidden',
      }"
    >
      <template #list-trailing>
        <LanguageSwitcher />
        <ColorModeButton />
      </template>
    </UNavigationMenu>
  </div>
</template>
