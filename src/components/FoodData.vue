<template>
  <div class="column justify-center" v-if="data !== undefined">
    <DataValidator :data="data" />
    <NutrientCharts :data="data" />
    <ProcessMap :data="data" @show-process="showProcess" />
    <FoodChainTree :data="data" ref="tree" />
    <div v-if="link !== undefined">
      <q-page-sticky position="bottom-right" :offset="[18, 18]">
        <q-btn
          fab
          icon="shopping_cart"
          color="cyan"
          label="Get Yours"
          @click="openLink"
        />
      </q-page-sticky>
    </div>
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
import { useQuasar } from 'quasar';
import NutrientCharts from 'components/NutrientCharts.vue';
import ProcessMap from 'components/ProcessMap.vue';
import FoodChainTree from './FoodChainTree.vue';
import { Ref, computed, onMounted, ref } from 'vue';
import { useFetch } from '@vueuse/core';
import type {
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
  clientSecret: string;
  projectId: string;
  collectionId: string;
  id: string;
}

const $q = useQuasar();

const props = defineProps<{
  args?: Args;
}>();

if (props.args === undefined)
  $q.notify({
    message: 'Demo mode',
    caption: 'URL parameters missing',
    timeout: 10000000,
    position: 'bottom-right',
    type: 'warning',
    closeBtn: true,
  });

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
      if (result.data.value !== null) {
        resolveUrls(result.data.value.metadata.sale).then(
          () => (data.value = result.data.value?.metadata.sale)
        );
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
        `https://www.crossmint.com/api/2022-06-09/collections/${props.args.collectionId}/nfts/${props.args.id}`,
        {
          beforeFetch(ctx) {
            ctx.options.headers = {
              ...ctx.options.headers,
              Accept: 'application/json',
              ...(props.args !== undefined
                ? {
                    'x-project-id': props.args.projectId,
                    'x-client-secret': props.args.clientSecret,
                  }
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
        .json<{ metadata: Pokedex }>()
    : undefined;

const link = computed((): string | undefined =>
  data.value !== undefined &&
  typeof data.value.inputInstances[0].instance === 'object' &&
  'type' in data.value.inputInstances[0].instance
    ? data.value.inputInstances[0].instance.iDs?.find(
        (id) => id.registry === 'URL_retail'
      )?.id
    : undefined
);

function openLink() {
  window.open(link.value, '_blank')?.focus();
}
</script>
