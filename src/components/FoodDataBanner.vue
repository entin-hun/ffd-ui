<template>
  <q-banner
    rounded
    class="bg-grey-3 text-black q-pa-none q-ma-none"
    style="min-height: 0"
  >
    <template v-slot:avatar>
      <q-avatar
        :icon="icon"
        class="bg-cyan text-white rounded-borders"
        square
      />
    </template>
    <template v-slot:default>
      <div class="text-h6">
        <slot />
      </div>
    </template>
  </q-banner>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
}>();
</script>
