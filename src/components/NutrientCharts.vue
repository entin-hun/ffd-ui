<template>
  <div class="q-pb-lg">
    <FoodDataBanner icon="percent">
      <div class="row justify-between items-center">
        <div class="col">
          Nutrients
          <q-icon name="info_outline">
            <q-popup-proxy>
              <q-banner>
                <div style="max-width: 30em">
                  Actual nutritional values may vary due to natural variations
                  in ingredients and processing. Nutritional values are rounded,
                  according to regulatory guidelines. Your total RDI values may
                  be higher or lower depending on your calorie needs. While we
                  strive to keep the nutritional information accurate, the
                  values provided are estimates and may not reflect all accurate
                  values. Nutritional information was sourced from the
                  <a
                    href="https://fdc.nal.usda.gov/fdc-app.html#/"
                    target="_blank"
                    >United States Department of Agriculture</a
                  >
                  upon loading the site.
                </div>
              </q-banner>
            </q-popup-proxy>
          </q-icon>
        </div>
        <q-select
          dense
          :options="chartScaleOptions"
          v-model="chartScale"
          style="width: 10em"
          :map-options="true"
          emit-value
          class="q-mr-sm"
          borderless
        />
      </div>
    </FoodDataBanner>
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
        v-if="
          nutrient.nutrient.id !== undefined &&
          nutrientsOfInterest.has(nutrient.nutrient.id)
        "
        :all-foods="foodNutrients"
        :nutrient="nutrient.nutrient"
        :enabled-foods="enabledFoodNutrients"
        :scale="chartScale"
        :total-weight="data.inputInstances[0].quantity"
        :rdi="nutrientsOfInterest.get(nutrient.nutrient.id)!"
      />
    </div>
    <FoodImpacts :enabled-foods="enabledFoodNutrients" />
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, onMounted, ref } from 'vue';
import {
  Process,
  FoodInstance,
  SaleProcess,
  FetchError,
  FallbackFoodNutrient,
} from '../models';
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
import { QSelectOption } from 'quasar';

const props = defineProps<{
  data: SaleProcess;
}>();

export type ChartScale =
  | 'total'
  | 'normalized'
  | 'rdi_child'
  | 'rdi_female'
  | 'rdi_male';

const chartScaleOptions = computed((): QSelectOption<ChartScale>[] => [
  {
    value: 'total',
    label: `Total (${props.data.inputInstances[0].quantity * 100} g)`,
  },
  { value: 'normalized', label: 'Per 100 g' },
  { value: 'rdi_child', label: '% RDI (child)' },
  { value: 'rdi_female', label: '% RDI (female)' },
  { value: 'rdi_male', label: '% RDI (male)' },
]);

const chartScale: Ref<ChartScale> = ref('total');

interface ResolvedFallbackFoodNutrient {
  amount: number;
  nutrient: Nutrient;
}

export interface FoodNutrients {
  instance: FoodInstance;
  color: string;
  nutrients: (FoodNutrient | ResolvedFallbackFoodNutrient)[] | FetchError;
}

const foodNutrients: Ref<FoodNutrients[]> = ref([]);

const fdcApi = new FDCApi(
  new Configuration({ apiKey: 'gQazulH9pUtEzMGwP1ecHI3762sRTAHsWUu7dzmB' })
);

export interface NutrientRdi {
  child: number;
  male: number;
  female: number;
}

const nutrientsOfInterest: Map<number, NutrientRdi> = new Map([
  /* Fiber, total dietary */
  [1079, { child: 25, female: 12.6, male: 16.7 }],
  /* Calcium, Ca */
  [1087, { child: 1, female: 800, male: 1000 }],
  /* Iron, Fe */
  [1089, { child: 10, female: 7, male: 10 }],
  /* Magnesium, Mg */
  [1090, { child: 130, female: 170, male: 170 }],
  /* Vitamin C, total ascorbic acid */
  [1162, { child: 25, female: 75, male: 75 }],
  /* Potassium, K */
  [1092, { child: 2, female: 2600, male: 3400 }],
  /* Zinc, Zn */
  [1095, { child: 5, female: 8, male: 10 }],
]);

let chartColorCounter = 0;

async function findInstanceNutrients(
  process: Process
): Promise<FoodNutrients[]> {
  return Promise.all(
    process.inputInstances.map(async ({ instance }) =>
      typeof instance === 'object' &&
      'category' in instance &&
      'type' in instance
        ? instance.iDs !== undefined || instance.nutrients !== undefined
          ? [
              {
                instance: instance,
                color: chartColors[chartColorCounter++ % chartColors.length],
                nutrients: await resolveNutrients(instance),
              },
            ]
          : instance.process !== undefined
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

async function resolveNutrients(
  instance: FoodInstance
): Promise<(FoodNutrient | ResolvedFallbackFoodNutrient)[] | FetchError> {
  return await (instance.iDs !== undefined
    ? resolveFdc(instance.iDs.id)
    : instance.nutrients !== undefined
    ? Promise.all(
        instance.nutrients.map(async (nutrient) =>
          resolveFallbackNutrient(nutrient)
        )
      )
    : Promise.reject(new Error('missing nutrient information')).catch((error) =>
        Promise.resolve({
          errorMessage: error.message,
        } as FetchError)
      ));
}

function resolveFdc(id: number): Promise<FoodNutrient[]> {
  return fdcApi
    .getFood(
      id.toFixed(),
      undefined,
      Array.from(nutrientsOfInterest.keys()) // doesn't work so we filter ourselves later
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
                nutrientsOfInterest.has(item.nutrient.id)
            )
          )
        : Promise.reject(new Error('Unrecognized response'))
    );
}

const fallbackResolver = fdcApi
  .getFood('2344739')
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
              nutrientsOfInterest.has(item.nutrient.id)
          )
        )
      : Promise.reject(new Error('Unrecognized response'))
  );

async function resolveFallbackNutrient(
  nutrient: FallbackFoodNutrient
): Promise<ResolvedFallbackFoodNutrient> {
  return fallbackResolver
    .then(
      (response) =>
        response.find(
          (fdcFoodNutrient) => fdcFoodNutrient.nutrient?.id === nutrient.iDs.id
        )?.nutrient
    )
    .then(
      (fdcNutrient) =>
        ({
          amount: nutrient.amount,
          nutrient: fdcNutrient,
        } as ResolvedFallbackFoodNutrient)
    );
}
</script>
