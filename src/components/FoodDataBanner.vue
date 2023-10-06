<template>
  <q-banner rounded class="bg-secondary text-black">
    <template v-slot:avatar>
      <q-avatar :icon="icon" class="bg-primary text-white" square rounded />
    </template>
    <template v-slot:default
      ><div class="text-h6">{{ text }}</div></template
    >
  </q-banner>
</template>

<script setup lang="ts">
defineProps<{
  icon: string;
  text: string;
}>();
</script>
