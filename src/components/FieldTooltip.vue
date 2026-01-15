<template>
  <q-icon
    v-if="description"
    name="info_outline"
    size="xs"
    class="q-ml-xs cursor-pointer"
    :color="color"
  >
    <q-tooltip :class="`bg-${tooltipColor || 'grey-9'}`" max-width="400px">
      <div class="text-body2">
        <strong>{{ description.label }}</strong>
      </div>
      <div class="text-caption q-mt-sm">
        {{ description.description }}
      </div>
      <div
        v-if="description.examples && description.examples.length > 0"
        class="text-caption q-mt-sm"
      >
        <div class="text-weight-medium">Examples:</div>
        <ul class="q-pl-md q-my-xs">
          <li v-for="example in description.examples" :key="example">
            {{ example }}
          </li>
        </ul>
      </div>
    </q-tooltip>
  </q-icon>
</template>

<script setup lang="ts">
import { computed } from 'vue';
import {
  getFieldDescription,
  type FieldDescription,
} from '@trace.market/types';

const props = defineProps<{
  typeName: string;
  fieldName: string;
  color?: string;
  tooltipColor?: string;
}>();

const description = computed((): FieldDescription | undefined => {
  return getFieldDescription(props.typeName, props.fieldName);
});
</script>
