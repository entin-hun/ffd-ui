<template>
  <div class="column justify-center" v-if="data !== undefined">
    <NutrientCharts :data="data" />
    <FoodFacts :data="data" />
    <ProcessMap :data="data" />
    <FoodChainTree :data="data" />
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
import FoodFacts from './FoodFacts.vue';

import { Ref, onMounted, ref } from 'vue';
// import { useFetch } from '@vueuse/core';
import {
  Process,
  // FetchError,
  // Pokedex,
  ProductInstance,
  SaleProcess,
  example,
} from '../models';
import axios from 'axios';

defineProps<{
  auth: string;
  contract: string;
  token: string;
}>();

const data: Ref<SaleProcess | undefined> = ref(undefined);

function resolveUrls(process: Process): Promise<void> {
  return Promise.all(
    process.inputInstances.map(async (inputInstance) =>
      (typeof inputInstance.instance === 'string'
        ? axios
            .get<ProductInstance>(inputInstance.instance)
            .then((result) => Promise.resolve(result.data))
            .catch((error) =>
              Promise.resolve({
                responseCode: error.statusCode,
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
