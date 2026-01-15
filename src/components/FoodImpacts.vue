<template>
  <div class="row justify-around">
    <div class="col-xs-0 col-sm-1" />
    <div class="column items-center col-3">
      <div class="text-h5 q-pa-sm impact-value text-no-wrap">
        {{ getTotalImpact('carbon').toFixed(2) }} kg
      </div>
      <div class="text-center impact-label">CO2e CARBON FOOTPRINT<br /></div>
    </div>
    <div class="column items-center col-3">
      <div class="text-h5 q-pa-sm impact-value text-no-wrap">
        {{ getTotalImpact('water').toFixed(2) }} l
      </div>
      <div class="text-center impact-label">WATER FOOTPRINT<br /></div>
    </div>
    <div class="column items-center col-3">
      <div class="text-h5 q-pa-sm impact-value text-no-wrap">
        {{ getBio() ? 'YES' : 'NO' }}
      </div>
      <div class="text-center impact-label">BIO</div>
    </div>
    <div class="col-xs-0 col-sm-1" />
  </div>
</template>

<script setup lang="ts">
import type { FoodInstance, Impact } from '@trace.market/types';
import { FoodNutrients } from './NutrientCharts.vue';

const props = defineProps<{
  enabledFoods?: FoodNutrients[];
}>();

function getBio() {
  return props.enabledFoods?.every((foodNutrient) => foodNutrient.instance.bio);
}

function getTotalImpact(category: string) {
  return props.enabledFoods
    ?.map((food) => getImpacts(food.instance, category))
    .flat()
    .map((impact) => impact.quantity)
    .reduce((prev, cur) => prev + cur, 0);
}

function getImpacts(instance: FoodInstance, category: string): Impact[] {
  return instance.process !== undefined
    ? [
        ...(instance.process.impacts !== undefined &&
        instance.process.impacts.length > 0
          ? instance.process.impacts.filter(
              (impact) => impact.category === category
            )
          : []),
        ...instance.process.inputInstances
          .map((inputInstance) =>
            typeof inputInstance.instance === 'object' &&
            'process' in inputInstance.instance &&
            inputInstance.instance.process !== undefined
              ? getImpacts(inputInstance.instance, category)
              : []
          )
          .flat(),
      ]
    : [];
}
</script>
<style>
.impact-label {
  max-width: 200px;
}

.impact-value {
  font-weight: bold;
}
</style>
