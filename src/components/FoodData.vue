<template>
  <div class="column justify-center" v-if="data !== undefined">
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
    <NutrientCharts :data="data" />
    <ProcessMap :data="data" @show-process="showProcess" />
    <FoodChainTree :data="data" ref="tree" />
  </div>
  <!-- <div
    v-else-if="request.isFetching && !request.isFinished"
    class="column justify-center text-center"
  >
    <p>Fetching data from Etherneum Swarm...</p>
    <div><q-spinner size="xl" /></div>
  </div>
  <div v-else-if="request.error" class="column text-center">
    <p>Error fetching data from Etherneum Swarm: {{ request.error }}</p>
  </div> -->
</template>

<script setup lang="ts">
import NutrientCharts from 'components/NutrientCharts.vue';
import ProcessMap from 'components/ProcessMap.vue';
import FoodChainTree from './FoodChainTree.vue';

import { Ref, computed, onMounted, ref } from 'vue';
// import { useFetch } from '@vueuse/core';
import {
  FetchError,
  FoodInstance,
  Process,
  // FetchError,
  // Pokedex,
  ProductInstance,
  SaleProcess,
  example,
} from '../models';
import axios, { AxiosError } from 'axios';

defineProps<{
  auth: string;
  contract: string;
  token: string;
}>();

const data: Ref<SaleProcess | undefined> = ref(undefined);
const tree = ref<InstanceType<typeof FoodChainTree>>();

function resolveUrls(process: Process): Promise<void> {
  return Promise.all(
    process.inputInstances.map(async (inputInstance) =>
      (typeof inputInstance.instance === 'string'
        ? axios
            .get<ProductInstance>(inputInstance.instance)
            .then((result) => Promise.resolve(result.data))
            .catch((error: AxiosError) =>
              Promise.resolve({
                errorMessage: error.message,
              })
            )
        : Promise.resolve(inputInstance.instance)
      ).then((resolved) => (inputInstance.instance = resolved))
    )
  ).then(() =>
    Promise.all(
      process.inputInstances.map((inputInstance) =>
        typeof inputInstance.instance === 'object' &&
        'process' in inputInstance.instance &&
        inputInstance.instance.process !== undefined
          ? resolveUrls(inputInstance.instance.process)
          : Promise.resolve()
      )
    ).then(() => Promise.resolve())
  );
}

onMounted(() =>
  resolveUrls(example.sale).then(() => (data.value = example.sale))
);

function showProcess(processId: number) {
  tree.value?.openProcess(processId);
}

const dataErrors = computed(() => [
  ...checkUnresolvedUrls(data.value),
  ...(data.value === undefined
    ? []
    : data.value.inputInstances
        .map((instance) =>
          typeof instance.instance === 'object' && 'type' in instance.instance
            ? checkNutrients(instance.instance)
            : []
        )
        .flat()),
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

// const url = `https://nft.api.infura.io/networks/137/nfts/${props.contract}/tokens/${props.token}`;

// const request = useFetch<FoodData>(url, {
//   beforeFetch(ctx) {
//     ctx.options.headers = {
//       ...ctx.options.headers,
//       Accept: 'application/json',
//       Authorization: props.auth,
//     };
//   },
// }).get();
</script>
