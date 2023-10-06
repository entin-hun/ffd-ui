<template>
  <div>
    <FoodDataBanner icon="fact_check" text="Quick Facts" />
    <div class="row justify-evenly q-pa-lg">
      <div class="column items-center">
        <div class="text-h2 q-pa-sm impact-value">
          {{ getTotalImpact('carbon') }} g
        </div>
        <div class="text-center impact-label">
          CO2e CARBON FOOTPRINT<br />(avoided)
        </div>
      </div>
      <div class="column items-center">
        <div class="text-h2 q-pa-sm impact-value">
          {{ getTotalImpact('water') }} l
        </div>
        <div class="text-center impact-label">
          WATER FOOTPRINT<br />(avoided)
        </div>
      </div>
      <div class="column items-center">
        <div class="text-h2 q-pa-sm impact-value">
          {{ getBio() ? 'YES' : 'NO' }}
        </div>
        <div class="text-center impact-label">BIO</div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { CarbonImpact, Process, SaleProcess } from 'src/models';
import FoodDataBanner from './FoodDataBanner.vue';

const props = defineProps<{
  data: SaleProcess;
}>();

function getBio() {
  return props.data.inputInstances.every(
    (inputInstance) =>
      typeof inputInstance.instance === 'object' &&
      'bio' in inputInstance.instance &&
      inputInstance.instance.bio
  );
}

function getTotalImpact(category: string) {
  return getImpacts(props.data, category)
    .map((impact) => impact.quantity)
    .reduce((prev, cur) => prev + cur);
}

function getImpacts(process: Process, category: string): CarbonImpact[] {
  return [
    ...(process.impacts !== undefined && process.impacts.length > 0
      ? process.impacts.filter(
          (impact): impact is CarbonImpact => impact.category === category
        )
      : []),
    ...process.inputInstances
      .map((inputInstance) =>
        typeof inputInstance.instance === 'object' &&
        'process' in inputInstance.instance &&
        inputInstance.instance.process !== undefined
          ? getImpacts(inputInstance.instance.process, category)
          : []
      )
      .flat(),
  ];
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
