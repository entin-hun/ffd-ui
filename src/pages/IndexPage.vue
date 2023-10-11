<template>
  <q-page padding>
    <!-- <p
      class="text-center"
      v-if="
        args.a === undefined || args.c === undefined || args.t === undefined
      "
    >
      Error: URL arguments missing
    </p> -->
    <!-- <FoodData v-else :auth="args.a" :contract="args.c" :token="args.t" /> -->
    <div class="q-ma-sm">
      We thought the below data could be essential to know what you eat, so we
      made it easily accessible. These values were published via Ethereum Swarm,
      the censorship-resistant decentralized storage.
    </div>
    <div class="row">
      <div class="col-12"><FoodData auth="" contract="" token="" /></div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FoodData from 'components/FoodData.vue';

import qs from 'query-string';

const args = qs.parse(qs.extract(window.location.href));
</script>
