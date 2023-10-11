<template>
  <div class="row col-12">
    <div class="col-3">
      {{ nutrient.name }}
    </div>
    <div class="chart-container col-7" style="position: relative; height: 2em">
      <Bar id="chart" :options="chartOptions" :data="chartData" />
    </div>
    <div class="col-2 q-px-md text-no-wrap">
      {{ Math.round(enabledAmounts * 100) / 100 }} {{ unit }}
    </div>
  </div>
</template>

<script setup lang="ts">
import { Nutrient } from 'src/fdc_api/generated/api';
import { computed } from 'vue';
import { ChartScale, FoodNutrients, NutrientRdi } from './NutrientCharts.vue';
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
  scale: ChartScale;
  totalWeight: number;
  rdi: NutrientRdi;
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
  return mapAmount(
    props.enabledFoods.includes(food)
      ? (food.nutrients.constructor === Array &&
          food.nutrients.find(
            (foodNutrient) =>
              'nutrient' in foodNutrient &&
              foodNutrient.nutrient?.id === props.nutrient.id
          )?.amount) ||
          0
      : 0
  );
}

const totalAmounts = computed(() =>
  mapAmount(
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
  )
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
        max:
          props.scale === 'rdi_child' ||
          props.scale === 'rdi_female' ||
          props.scale === 'rdi_male'
            ? 50
            : totalAmounts.value,
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

function mapAmount(amount: number): number {
  switch (props.scale) {
    case 'total':
      return amount;
    case 'normalized':
      return (amount / props.totalWeight) * 100;
    case 'rdi_child':
      return (amount / props.rdi.child) * 100;
    case 'rdi_female':
      return (amount / props.rdi.female) * 100;
    case 'rdi_male':
      return (amount / props.rdi.male) * 100;
  }
}

const unit = computed(() =>
  props.scale === 'total' || props.scale === 'normalized'
    ? props.nutrient.unitName
    : '%'
);
</script>
