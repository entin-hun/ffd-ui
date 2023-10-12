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
import { FoodInstance, Process, SaleProcess } from 'src/models';
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
</script>
