<template>
  <div />
</template>

<script setup lang="ts">
import type { FoodInstance, Process, SaleProcess } from '@fairfooddata/types';
import { useQuasar } from 'quasar';

import { computed } from 'vue';

const props = defineProps<{
  data: SaleProcess;
}>();

const dataErrors = computed(() => [
  ...checkUnresolvedUrls(props.data),
  ...(props.data === undefined
    ? []
    : props.data.inputInstances
        .map((instance) =>
          typeof instance.instance === 'object' && 'type' in instance.instance
            ? checkNutrients(instance.instance)
            : []
        )
        .flat()),
  ...checkTransports(props.data),
]);

function checkUnresolvedUrls(process?: Process): string[] {
  return process === undefined
    ? []
    : process.inputInstances
        .map((inputInstance) =>
          typeof inputInstance.instance === 'object'
            ? 'errorMessage' in inputInstance.instance
              ? [
                  `${process.type} has unresolvable input instance (${inputInstance.instance.errorMessage})`,
                ]
              : 'process' in inputInstance.instance
              ? checkUnresolvedUrls(inputInstance.instance.process)
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
            'type' in inputInstance.instance
              ? checkNutrients(inputInstance.instance)
              : []
          )
          .flat();

  return inputErrors;
}

function checkTransports(process: Process): string[] {
  /* TODO check if every inputInstance is either geographically
   * local or has transport
   */
  return [];
}

const $q = useQuasar();

if (dataErrors.value.length > 0)
  $q.notify({
    message:
      'Some data sources were unavailable or invalid. Data on this page are based on partial information.',
    timeout: 10000000,
    position: 'bottom-right',
    type: 'warning',
    closeBtn: true,
  });
</script>
