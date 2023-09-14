<template>
  <div
    class="chart-container"
    style="position: relative; height: 40vh; width: 100vw; max-width: 1000px"
  >
    <Bar id="chart" :options="chartOptions" :data="chartData" />
  </div>
</template>

<script setup lang="ts">
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
import { computed } from 'vue';
import { FoodComponent } from './models';

ChartJS.register(Title, Tooltip, BarElement, CategoryScale, LinearScale);

const props = defineProps<{
  enabledComponents: FoodComponent[];
  nutrients: string[];
}>();

const chartData = computed((): ChartData => {
  return {
    labels: props.nutrients,
    datasets: props.enabledComponents.map((component) => ({
      label: component.name,
      data: props.nutrients.map(
        (nutrientName) =>
          component.nutrients.find((nutrient) => nutrient.type === nutrientName)
            ?.value || 0
      ),
      backgroundColor: component.color,
    })),
  };
});

const chartOptions: ChartOptions = {
  responsive: true,
  indexAxis: 'y',
  scales: {
    x: {
      stacked: true,
    },
    y: {
      stacked: true,
    },
  },
};
</script>
