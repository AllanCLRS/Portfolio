<script setup lang="ts">
import type { NuxtError } from "#app";

defineProps<{ error: NuxtError }>();

const { t } = useI18n();
const localePath = useLocalePath();
</script>

<template>
  <UApp>
    <UContainer class="sm:border-x border-default min-h-screen flex items-center justify-center">
      <div class="flex flex-col items-center gap-4 py-24 text-center">
        <p class="text-6xl font-bold tabular-nums text-highlighted">
          {{ error.statusCode }}
        </p>
        <p class="text-muted">
          {{ error.statusCode === 404 ? t("error.notFound") : t("error.generic") }}
        </p>
        <UButton
          :to="localePath('/')"
          icon="i-lucide-house"
          color="neutral"
          variant="subtle"
          :label="t('error.backHome')"
          @click="clearError({ redirect: localePath('/') })"
        />
      </div>
    </UContainer>
  </UApp>
</template>
