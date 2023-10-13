<template>
  <q-page padding>
    <div class="q-ma-sm">
      We thought the below data could be essential to know what you eat, so we
      made it easily accessible. These values were published via Ethereum Swarm,
      the censorship-resistant decentralized storage.
    </div>
    <div class="row">
      <div class="col-12">
        <FoodData :args="args" />
      </div>
    </div>
  </q-page>
</template>

<script setup lang="ts">
import FoodData, { Args } from 'components/FoodData.vue';

import qs from 'query-string';
import { computed } from 'vue';

const args = computed((): Args | undefined => {
  const args = qs.parse(qs.extract(window.location.href));

  if (!('n' in args) || args.n === null || typeof args.n !== 'string')
    return undefined;
  const [project, collection, id, secret] = args.n.split('|');

  return project !== undefined &&
    collection !== undefined &&
    id !== undefined &&
    secret !== undefined
    ? {
        projectId: project,
        collectionId: collection,
        id: id,
        clientSecret: `sk_live.${secret}`,
      }
    : undefined;
});
</script>
