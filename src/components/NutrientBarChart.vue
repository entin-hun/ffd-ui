<template>
  <div class="row col-12">
    <div class="col-3">
      {{ nutrient.name }}
    </div>
    <div class="chart-container col-7" style="position: relative; height: 2em">
      <Bar id="chart" :options="chartOptions" :data="chartData" />
      <!-- Middle column -->
    </div>
    <div class="col-2 q-px-md">
      {{ Math.round(enabledAmounts * 100) / 100 }} {{ nutrient.unitName }}
    </div>
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

const chartData = computed((): ChartData<'bar'> => {
  let total = 0;

  return {
    labels: [''],
    datasets: props.allFoods.map((food) => {
      const amount = getEnabledAmount(food);

      const roundLeft = total === 0 ? Number.MAX_VALUE : 0;
      const roundRight =
        total + amount === enabledAmounts.value ? Number.MAX_VALUE : 0;

      const result = {
        label: food.instance.type,
        data: [amount],
        backgroundColor: colors.getPaletteColor(food.color),
        borderRadius: {
          topLeft: roundLeft,
          bottomLeft: roundLeft,
          topRight: roundRight,
          bottomRight: roundRight,
        },
        borderSkipped: false,
      };

      total += amount;

      return result;
    }),
  };
});

const enabledAmounts = computed(() =>
  props.allFoods
    .map((food) => getEnabledAmount(food))
    .reduce((prev, cur) => prev + cur, 0)
);

function getEnabledAmount(food: FoodNutrients): number {
  return props.enabledFoods.includes(food)
    ? (food.nutrients.constructor === Array &&
        food.nutrients.find(
          (foodNutrient) =>
            'nutrient' in foodNutrient &&
            foodNutrient.nutrient?.id === props.nutrient.id
        )?.amount) ||
        0
    : 0;
}

const totalAmounts = computed(() =>
  props.allFoods
    .map(
      (food) =>
        (food.nutrients.constructor === Array &&
          food.nutrients.find(
            (nutrient) => nutrient.nutrient?.id === props.nutrient.id
          )?.amount) ||
        0
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
