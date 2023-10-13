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
  return 'collection' in args &&
    'project' in args &&
    'id' in args &&
    'secret' in args &&
    typeof args.collection === 'string' &&
    typeof args.project === 'string' &&
    typeof args.id === 'string' &&
    typeof args.secret === 'string'
    ? {
        collectionId: args.collection,
        projectId: args.project,
        id: args.id,
        clientSecret: args.secret,
      }
    : undefined;
});
</script>
