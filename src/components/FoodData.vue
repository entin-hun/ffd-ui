<template>
  <div class="column justify-center" v-if="data !== undefined">
    <NutrientCharts :data="data" />
    <ProcessMap :data="data" @show-process="showProcess" />
    <FoodChainTree :data="data" ref="tree" />
    <DataValidator :data="data" />
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
      <p>Fetching data...</p>
      <div><q-spinner size="xl" /></div>
    </div>
    <div v-else-if="request.error.value != null" class="column text-center">
      <p>Error fetching data: {{ request.error }}</p>
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
  Priced,
  ProductInstance,
  TokenId,
} from '@fairfooddata/types';
import { example } from '../example';

import { api } from 'boot/axios';
// import typia from 'typia';

interface MinterMetadataResponse {
  swarmReference: string;
  content: Pokedex & { _nftId: TokenId };
}

const $q = useQuasar();

const props = defineProps<{
  tokenId: TokenId | undefined;
}>();

if (props.tokenId === undefined)
  $q.notify({
    message: 'Demo mode',
    caption: 'URL parameters missing',
    timeout: 10000000,
    position: 'bottom-right',
    type: 'warning',
    closeBtn: true,
  });

const data: Ref<Priced<ProductInstance> | undefined> = ref(undefined);
const tree = ref<InstanceType<typeof FoodChainTree>>();

function resolveTokenIds(instance: ProductInstance): Promise<void> {
  return instance.category !== 'food' || instance.process === undefined
    ? Promise.resolve()
    : Promise.all(
        instance.process.inputInstances.map(async (inputInstance) =>
          (typeof inputInstance.instance === 'string'
            ? api
                .get<MinterMetadataResponse>(
                  `/metadata/${inputInstance.instance}`
                )
                .then((result) =>
                  Promise.resolve({
                    _tokenId: result.data.content._nftId,
                    ...result.data.content.instance,
                  })
                )
            : // .catch((error: AxiosError) =>
              //   Promise.resolve({
              //     errorMessage: error.message,
              //   })
              // )
              Promise.resolve(inputInstance.instance)
          ).then((resolved) => (inputInstance.instance = resolved))
        )
      ).then(() =>
        instance.process === undefined
          ? Promise.resolve()
          : Promise.all(
              instance.process.inputInstances.map((inputInstance) =>
                typeof inputInstance.instance === 'object' &&
                'process' in inputInstance.instance &&
                inputInstance.instance.process !== undefined
                  ? resolveTokenIds(inputInstance.instance)
                  : Promise.resolve()
              )
            ).then(() => Promise.resolve())
      );
}

onMounted(() => {
  if (request === undefined)
    resolveTokenIds(example.instance).then(
      () => (data.value = example.instance)
    );
  else
    request.then((result) => {
      if (result.data.value !== null) {
        resolveTokenIds(result.data.value.content.instance).then(
          () => (data.value = result.data.value?.content.instance)
        );
      }
    });
});

function showProcess(processId: number) {
  tree.value?.openProcess(processId);
}

// const assertPokedex = typia.createAssert<Pokedex>();

const request =
  props.tokenId !== undefined
    ? useFetch(`https://api.trace.market/metadata/${props.tokenId}`, {
        // afterFetch(ctx) {
        //   assertPokedex(ctx);
        //   return ctx;
        // },
      })
        .get()
        .json<MinterMetadataResponse>()
    : undefined;

// const request =
//   props.tokenId !== undefined
//     ? api.get(`/metadata/${props.tokenId}`)
//     : undefined;

const link = computed((): string | undefined =>
  data.value !== undefined &&
  typeof data.value === 'object' &&
  'category' in data.value &&
  data.value.category === 'food'
    ? data.value.iDs?.find((id) => id.registry === 'URL_retail')?.id
    : undefined
);

function openLink() {
  window.open(link.value, '_blank')?.focus();
}
</script>
