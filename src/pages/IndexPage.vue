<template>
  <q-page padding>
    <div class="q-ma-sm">
      We thought the below data could be essential to know what you eat, so we
      made it easily accessible. These values were published via Ethereum Swarm,
      the censorship-resistant decentralized storage.
    </div>
    <div class="row">
      <div class="col-12">
        <FoodData :token-id="tokenId" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FoodData from 'components/FoodData.vue';

import qs from 'query-string';
import { computed } from 'vue';

const tokenId = computed((): string | undefined => {
  const args = qs.parse(qs.extract(window.location.href));

  return typeof args['p'] === 'string' ? args['p'] : undefined;
});
</script>
