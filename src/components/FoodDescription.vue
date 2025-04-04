<template>
  <div v-html="description" />
</template>

<script setup lang="ts">
import { Pokedex } from '@fairfooddata/types';
import { computed } from 'vue';

const props = defineProps<{ data: Pokedex }>();

const description = computed(() => props.data.description);
</script>
