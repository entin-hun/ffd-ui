<template>
  <div class="row justify-center">
    <q-chip
      clickable
      v-for="(component, index) in components"
      :key="index"
      :color="component.color"
      :outline="!componentState[index]"
      @click="toggle(index)"
      :label="component.name"
      :text-color="componentState[index] ? 'black' : component.color"
    />
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import { FoodComponent } from './models';

const props = defineProps<{
  components: FoodComponent[];
}>();

const emit = defineEmits<{
  change: [selected: FoodComponent[]];
}>();

const componentState = ref(Array<boolean>(props.components.length).fill(true));

function toggle(index: number) {
  componentState.value[index] = !componentState.value[index];
  emitChange();
}

function emitChange() {
  emit(
    'change',
    props.components.filter((_, i) => componentState.value[i])
  );
}

emitChange();
</script>
