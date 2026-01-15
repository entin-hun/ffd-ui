<template>
  <q-page padding>
    <HeaderProdsum :instance="productInstance" />
    <div class="row">
      <div class="col-12">
        <FoodData :token-id="tokenId" :data="metadata" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import type { Pokedex, ProductInstance, TokenId } from '@trace.market/types';
import FoodData from 'components/FoodData.vue';
import HeaderProdsum from 'components/HeaderProdsum.vue';

import qs from 'query-string';
import { computed, ref, onMounted, watch } from 'vue';

const tokenId = computed((): TokenId | undefined => {
  const args = qs.parse(qs.extract(window.location.href));

  return typeof args.tokenId === 'string'
    ? (args['tokenId'] as TokenId)
    : undefined;
});

const productInstance = ref<ProductInstance | undefined>(undefined);
const metadata = ref<Pokedex | undefined>(undefined);

async function loadInstance() {
  if (!tokenId.value) {
    productInstance.value = undefined;
    metadata.value = undefined;
    return;
  }
  try {
    const res = await fetch(
      `https://api.trace.market/metadata/${tokenId.value}`
    );
    const data = await res.json();
    metadata.value = data?.content as Pokedex | undefined;
    productInstance.value = data?.content?.instance as
      | ProductInstance
      | undefined;
  } catch (err) {
    productInstance.value = undefined;
    metadata.value = undefined;
  }
}

onMounted(loadInstance);
watch(tokenId, loadInstance);
</script>
