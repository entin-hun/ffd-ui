<template>
  <div class="column justify-center" v-if="data !== null">
    <FoodComponentSelector
      :components="data.components.food"
      @change="componentsChanged"
    />
    <NutrientChart
      :enabled-components="enabledComponents"
      :nutrients="allNutrients"
    />
  </div>
  <div
    v-else-if="request.isFetching && !request.isFinished"
    class="column justify-center text-center"
  >
    <p>Fetching data from Etherneum Swarm...</p>
    <div><q-spinner size="xl" /></div>
  </div>
  <div v-else-if="request.error" class="column text-center">
    <p>Error fetching data from Etherneum Swarm: {{ request.error }}</p>
  </div>
</template>

<script setup lang="ts">
import { FoodData, FoodComponent } from './models';
import FoodComponentSelector from 'components/FoodComponentSelector.vue';
import NutrientChart from 'components/NutrientChart.vue';
import { chartColors } from './ChartColors';
import { computed, ref } from 'vue';
import { useFetch } from '@vueuse/core';

// const rawData = {
//   contract: '0x78331a8c0089cf29185f2cc9aea97f7b6e9f8fb6',
//   tokenId: '19',
//   metadata: {
//     '0': {
//       components: [
//         {
//           mango: [
//             {
//               category: 'food',
//               'FDC ID': '2346409',
//             },
//             {
//               trait_type: 'weight(g)',
//               value: 33,
//             },
//             {
//               trait_type: 'fiber',
//               value: 23,
//             },
//             {
//               trait_type: 'vitamin C',
//               value: 23,
//             },
//             {
//               trait_type: 'iron',
//               value: 5,
//             },
//             {
//               trait_type: 'zinc',
//               value: 2,
//             },
//             {
//               trait_type: 'calcium',
//               value: 2,
//             },
//             {
//               trait_type: 'magnesium',
//               value: 2,
//             },
//           ],
//           pear: [
//             {
//               trait_type: 'weight(g)',
//               value: 119,
//             },
//             {
//               category: 'food',
//             },
//             {
//               trait_type: 'fiber',
//               value: 23,
//             },
//             {
//               trait_type: 'vitamin C',
//               value: 40,
//             },
//             {
//               trait_type: 'iron',
//               value: 10,
//             },
//             {
//               trait_type: 'zinc',
//               value: 2,
//             },
//             {
//               trait_type: 'calcium',
//               value: 2,
//             },
//             {
//               trait_type: 'magnesium',
//               value: 2,
//             },
//           ],
//         },
//         {
//           category: 'cartridge',
//           description: 'by Ivan Pascual on 12th June',
//         },
//         {
//           trait_type: 'license',
//           value: 'turtle.stl by unknown',
//         },
//         {
//           service: [
//             {
//               display_type: 'date',
//               trait_type: 'service_start',
//               value: 1687420800,
//             },
//             {
//               display_type: 'date',
//               trait_type: 'service_end',
//               value: 1687422000,
//             },
//           ],
//         },
//       ],
//     },
//   },
//   deprecation: 'November 1st, 2023 12:00 UTC',
// };

const props = defineProps<{
  auth: string;
  contract: string;
  token: string;
}>();

const url = `https://nft.api.infura.io/networks/137/nfts/${props.contract}/tokens/${props.token}`;

const request = useFetch<FoodData>(url, {
  beforeFetch(ctx) {
    ctx.options.headers = {
      ...ctx.options.headers,
      Accept: 'application/json',
      Authorization: props.auth,
    };
  },
}).get();

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function normalize(rawData: any): FoodData | null {
  if (rawData === null) return null;

  let value: FoodData = {
    components: {
      food: [],
      non_food: [],
    },
  };

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const foodComponents: any = rawData.metadata[0].components[0];

  let counter = 0;

  Object.keys(foodComponents).forEach((componentName) => {
    const component = foodComponents[componentName];

    value.components.food.push({
      name: componentName,
      unit: {
        type: 'g',
        value: component.find(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (componentInfo: any) => componentInfo.trait_type === 'weight(g)'
        ).value,
      },
      color: chartColors[(counter * 9) % chartColors.length],
      nutrients: component
        .filter(
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          (componentInfo: any) =>
            componentInfo.trait_type !== 'weight(g)' &&
            componentInfo.category === undefined
        )
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .map((nutrient: any) => ({
          type: nutrient.trait_type,
          value: nutrient.value,
        })),
    });

    counter++;
  });

  return value;
}

const data = computed(() => normalize(request.json()?.data.value || null));

const allNutrients = computed(() => [
  ...new Set(
    data.value?.components.food
      .flatMap((component) => component.nutrients)
      .map((nutrient) => nutrient.type)
  ),
]);

const enabledComponents = ref(Array<FoodComponent>());

function componentsChanged(components: FoodComponent[]) {
  enabledComponents.value = components;
}
</script>
