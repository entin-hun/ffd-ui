<template>
  <div class="row justify-center q-pa-md">
    <q-chip
      clickable
      v-for="(foodNutrient, index) in foodNutrients"
      :key="index"
      :color="foodNutrient.color"
      :outline="!instanceState[index]"
      @click="toggle(index)"
      :label="foodNutrient.instance.type"
      :text-color="instanceState[index] ? 'black' : foodNutrient.color"
    />
  </div>
</template>

<script setup lang="ts">
import { Ref, computed, ref, watch } from 'vue';
import { FoodNutrients } from './NutrientCharts.vue';

const props = defineProps<{
  foodNutrients: FoodNutrients[];
}>();

const emit = defineEmits<{
  change: [selected: FoodNutrients[]];
}>();

const instanceState: Ref<boolean[]> = ref([]);

function toggle(index: number) {
  instanceState.value[index] = !instanceState.value[index];
  emitChange();
}

function emitChange() {
  emit(
    'change',
    props.foodNutrients.filter((_, i) => instanceState.value[i])
  );
}

const abc = computed(() => props.foodNutrients);

watch(abc, (newValue) => {
  instanceState.value.length = newValue.length;
  instanceState.value.fill(true);
});

emitChange();
</script>
