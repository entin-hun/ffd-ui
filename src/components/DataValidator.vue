<template>
  <q-banner
    rounded
    class="bg-warning text-black q-my-md"
    v-if="dataErrors.length > 0"
  >
    <template v-slot:avatar>
      <q-avatar icon="warning" class="bg-primary text-white" square rounded />
    </template>
    <template v-slot:default
      ><div>
        Some data sources were unavailable or invalid. Data below are based on
        partial information:
        <ul>
          <li v-for="error in dataErrors" :key="error">{{ error }}</li>
        </ul>
      </div></template
    >
  </q-banner>
</template>

<script setup lang="ts">
import type { FoodInstance, ProductInstance } from '@fairfooddata/types';

import { computed } from 'vue';

const props = defineProps<{
  data: ProductInstance;
}>();

const dataErrors = computed(() => [
  ...checkUnresolvedUrls(props.data),
  ...(props.data === undefined ||
  !('process' in props.data) ||
  props.data.process === undefined
    ? []
    : props.data.process.inputInstances
        .map((instance) =>
          typeof instance.instance === 'object' &&
          'category' in instance.instance &&
          instance.instance.category === 'food'
            ? checkNutrients(instance.instance)
            : []
        )
        .flat()),
  ...checkTransports(props.data),
]);

function checkUnresolvedUrls(instance?: ProductInstance): string[] {
  return instance === undefined ||
    !('process' in instance) ||
    instance.process === undefined
    ? []
    : instance.process.inputInstances
        .map((inputInstance) =>
          typeof inputInstance.instance === 'object'
            ? 'errorMessage' in inputInstance.instance
              ? [
                  `${instance.process?.type} has unresolvable input instance (${inputInstance.instance.errorMessage})`,
                ]
              : 'process' in inputInstance.instance
              ? checkUnresolvedUrls(inputInstance.instance)
              : []
            : []
        )
        .flat();
}

function checkNutrients(instance: FoodInstance): string[] {
  if (instance.nutrients !== undefined || instance.iDs !== undefined) return [];

  if (instance.process === undefined)
    return [`${instance.type} is missing nutrient information`];

  const inputErrors =
    instance.process === undefined
      ? []
      : instance.process.inputInstances
          .map((inputInstance) =>
            typeof inputInstance.instance === 'object' &&
            'category' in inputInstance.instance &&
            inputInstance.instance.category === 'food'
              ? checkNutrients(inputInstance.instance)
              : []
          )
          .flat();

  return inputErrors;
}

function checkTransports(instance: ProductInstance): string[] {
  /* TODO check if every inputInstance is either geographically
   * local or has transport
   */
  return [];
}
</script>
