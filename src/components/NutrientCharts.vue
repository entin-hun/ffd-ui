<template>
  <div class="q-pb-lg">
    <FoodDataBanner icon="percent" text="Nutrients" />
    <FoodInstanceSelector
      :food-nutrients="foodNutrients"
      @change="foodsChanged"
    />
    <div
      v-for="nutrient in allNutrients.values()"
      :key="nutrient.nutrient.id"
      class="q-mx-md row justify-between"
    >
      <NutrientBarChart
        :all-foods="foodNutrients"
        :nutrient="nutrient.nutrient"
        :enabled-foods="enabledFoodNutrients"
      />
    </div>
    <FoodImpacts :enabled-foods="enabledFoodNutrients" />
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';
import { Process, FoodInstance, SaleProcess, FetchError } from '../models';
import FoodDataBanner from './FoodDataBanner.vue';
import FoodInstanceSelector from './FoodInstanceSelector.vue';
import {
  FDCApi,
  Configuration,
  Nutrient,
  FoodNutrient,
} from 'src/fdc_api/generated';
import { chartColors } from './utils';
import NutrientBarChart from './NutrientBarChart.vue';
import FoodImpacts from './FoodImpacts.vue';

const props = defineProps<{
  data: SaleProcess;
}>();

interface ResolvedFallbackNutrient {
  amount: number;
  nutrient: Nutrient;
}

export interface FoodNutrients {
  instance: FoodInstance;
  color: string;
  nutrients: (FoodNutrient | ResolvedFallbackNutrient)[] | FetchError;
}

const foodNutrients: Ref<FoodNutrients[]> = ref([]);

const fdcApi = new FDCApi(
  new Configuration({ apiKey: 'gQazulH9pUtEzMGwP1ecHI3762sRTAHsWUu7dzmB' })
);

const nutrientsOfInterest = [1079, 1087, 1089, 1090, 1162, 1092, 1095];

let chartColorCounter = 0;

async function findInstanceNutrients(
  process: Process
): Promise<FoodNutrients[]> {
  return Promise.all(
    process.inputInstances.map(async ({ instance }) =>
      typeof instance === 'object' && 'category' in instance
        ? 'iDs' in instance && instance.iDs !== undefined
          ? [
              {
                instance: instance,
                color: chartColors[chartColorCounter++ % chartColors.length],
                nutrients:
                  instance.iDs !== undefined
                    ? await fdcApi
                        .getFood(
                          instance.iDs.id.toFixed(),
                          undefined,
                          nutrientsOfInterest // doesn't work so we filter ourselves later
                        )
                        .then((response) =>
                          typeof response.data === 'object' &&
                          'foodNutrients' in response.data &&
                          response.data.foodNutrients !== undefined
                            ? Promise.resolve(
                                response.data.foodNutrients.filter(
                                  (item): item is FoodNutrient =>
                                    'nutrient' in item &&
                                    item.nutrient !== undefined &&
                                    item.nutrient?.id != undefined &&
                                    nutrientsOfInterest.includes(
                                      item.nutrient.id
                                    )
                                )
                              )
                            : Promise.reject()
                        )
                        .catch((error) =>
                          Promise.resolve({
                            errorMessage: error.message,
                          })
                        )
                    : // : instance.nutrients !== undefined
                      // ?
                      //   instance.nutrients.map<ResolvedFallbackNutrient>((nutrient) => ({
                      //     amount: nutrient.amount,
                      //     nutrient: fdcApi.get
                      //   }))

                      [],
              },
            ]
          : 'process' in instance && instance.process !== undefined
          ? findInstanceNutrients(instance.process)
          : []
        : []
    )
  ).then((result) => Promise.resolve(result.flat()));
}

const allNutrients = computed(() => {
  const nutrientsById: Map<
    number,
    { nutrient: Nutrient; foods: FoodNutrients[] }
  > = new Map();

  foodNutrients.value.forEach((foodNutrients) => {
    'errorMessage' in foodNutrients.nutrients
      ? []
      : foodNutrients.nutrients.forEach((nutrient) => {
          if (
            !('nutrient' in nutrient) ||
            nutrient.amount === 0 ||
            nutrient.nutrient === undefined ||
            nutrient.nutrient.id === undefined
          )
            return;
          const nutrients = nutrientsById.get(nutrient.nutrient.id);
          if (nutrients === undefined) {
            nutrientsById.set(nutrient.nutrient.id, {
              nutrient: nutrient.nutrient,
              foods: [foodNutrients],
            });
          } else {
            nutrients.foods.push(foodNutrients);
          }
        });
  });

  return nutrientsById;
});

const enabledFoodNutrients = ref(Array<FoodNutrients>());

onMounted(() =>
  findInstanceNutrients(props.data).then((result) => {
    foodNutrients.value = result;
    enabledFoodNutrients.value = foodNutrients.value;
  })
);

function foodsChanged(components: FoodNutrients[]) {
  enabledFoodNutrients.value = components;
}
</script>
