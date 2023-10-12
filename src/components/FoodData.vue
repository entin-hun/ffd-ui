<template>
  <q-banner
    rounded
    class="bg-warning text-black q-my-md"
    v-if="props.args === undefined"
  >
    <template v-slot:avatar>
      <q-avatar icon="warning" class="bg-primary text-white" square rounded />
    </template>
    URL arguments missing; running in demo mode
  </q-banner>

  <div class="column justify-center" v-if="data !== undefined">
    <DataValidator :data="data" />
    <NutrientCharts :data="data" />
    <ProcessMap :data="data" @show-process="showProcess" />
    <FoodChainTree :data="data" ref="tree" />
  </div>

  <div v-if="request !== undefined">
    <div
      v-if="request.isFetching.value"
      class="column justify-center text-center"
    >
      <p>Fetching data from Etherneum Swarm...</p>
      <div><q-spinner size="xl" /></div>
    </div>
    <div v-else-if="request.error.value != null" class="column text-center">
      <p>Error fetching data from Etherneum Swarm: {{ request.error }}</p>
    </div>
    <div v-else />
  </div>
</template>

<script setup lang="ts">
import DataValidator from './DataValidator.vue';
import NutrientCharts from 'components/NutrientCharts.vue';
import ProcessMap from 'components/ProcessMap.vue';
import FoodChainTree from './FoodChainTree.vue';
import { Ref, onMounted, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import {
  Pokedex,
  Process,
  ProductInstance,
  SaleProcess,
} from '@fairfooddata/types';
import { example } from '../example';

import { AxiosError } from 'axios';
import { api } from 'boot/axios';
// import typia from 'typia';

export interface Args {
  auth: string;
  contract: string;
  token: string;
}

const props = defineProps<{
  args?: Args;
}>();

const data: Ref<SaleProcess | undefined> = ref(undefined);
const tree = ref<InstanceType<typeof FoodChainTree>>();

function resolveUrls(process: Process): Promise<void> {
  return Promise.all(
    process.inputInstances.map(async (inputInstance) =>
      (typeof inputInstance.instance === 'string'
        ? api
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

onMounted(() => {
  if (request === undefined)
    resolveUrls(example.sale).then(() => (data.value = example.sale));
  else
    request.then((result) => {
      console.log(result.data.value);
      if (result.data.value !== null) {
        resolveUrls(result.data.value.sale);
        data.value = result.data.value.sale;
      }
    });
});

function showProcess(processId: number) {
  tree.value?.openProcess(processId);
}

// const assertPokedex = typia.createAssert<Pokedex>();

const request =
  props.args !== undefined
    ? useFetch(
        `https://nft.api.infura.io/networks/137/nfts/${props.args.contract}/tokens/${props.args.token}`,
        {
          beforeFetch(ctx) {
            ctx.options.headers = {
              ...ctx.options.headers,
              Accept: 'application/json',
              ...(props.args !== undefined
                ? { Authorization: props.args.auth }
                : {}),
            };
          },
          // afterFetch(ctx) {
          //   assertPokedex(ctx);
          //   return ctx;
          // },
        }
      )
        .get()
        .json<Pokedex>()
    : undefined;
</script>
../example
