<template>
  <div style="width: 10em">
    {{ nutrient.name }}
  </div>
  <div
    class="chart-container"
    style="position: relative; height: 3vh; width: 40%"
  >
    <Bar id="chart" :options="chartOptions" :data="chartData" />
  </div>
  <div style="width: 8em" class="q-px-sm">
    {{ Math.round(enabledAmounts * 100) / 100 }} {{ nutrient.unitName }}
  </div>
</template>

<script setup lang="ts">
import { Nutrient } from 'src/fdc_api/generated/api';
import { computed } from 'vue';
import { FoodNutrients } from './NutrientCharts.vue';
import { Bar } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  BarElement,
  CategoryScale,
  LinearScale,
  ChartOptions,
  ChartData,
} from 'chart.js';
import { colors } from 'quasar';

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  nutrient: Nutrient;
  allFoods: FoodNutrients[];
  enabledFoods: FoodNutrients[];
}>();

const chartData = computed(
  (): ChartData<'bar'> => ({
    labels: [''],
    datasets: props.allFoods.map((food) => ({
      label: food.instance.type,
      data: [getEnabledAmount(food)],
      backgroundColor: colors.getPaletteColor(food.color),
      borderRadius: Number.MAX_VALUE,
      borderSkipped: false,
    })),
  })
);

const enabledAmounts = computed(() =>
  props.allFoods
    .map((food) => getEnabledAmount(food))
    .reduce((prev, cur) => prev + cur, 0)
);

function getEnabledAmount(food: FoodNutrients): number {
  return props.enabledFoods.includes(food)
    ? food.nutrients.find(
        (foodNutrient) =>
          'nutrient' in foodNutrient &&
          foodNutrient.nutrient?.id === props.nutrient.id
      )?.amount || 0
    : 0;
}

const totalAmounts = computed(() =>
  props.allFoods
    .map(
      (food) =>
        food.nutrients.find(
          (nutrient) => nutrient.nutrient?.id === props.nutrient.id
        )?.amount || 0
    )
    .reduce((prev, cur) => prev + cur, 0)
);

const chartOptions = computed(
  (): ChartOptions<'bar'> => ({
    responsive: true,
    indexAxis: 'y',
    maintainAspectRatio: false,
    backgroundColor: 'red',
    scales: {
      x: {
        stacked: true,
        min: 0,
        max: totalAmounts.value,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
      y: {
        stacked: true,
        min: 0,
        ticks: {
          display: false,
        },
        grid: {
          display: false,
        },
        border: {
          display: false,
        },
      },
    },
  })
);
</script>
