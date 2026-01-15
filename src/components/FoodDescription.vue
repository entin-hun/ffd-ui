<template>
  <div
    v-html="description"
    style="width: 95%; align-self: center"
    class="q-py-md"
  />
</template>

<script setup lang="ts">
import { Pokedex } from '@trace.market/types';
import { computed } from 'vue';

const props = defineProps<{ data: Pokedex }>();

const description = computed(() => props.data.description);
</script>
