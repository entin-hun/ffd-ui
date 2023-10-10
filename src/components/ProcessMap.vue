<template>
  <FoodDataBanner icon="map" text="Map of Activities" />
  <div class="q-pa-md">
    <MapboxMap
      accessToken="pk.eyJ1Ijoic3phYm9sY3NzemVrZWx5aSIsImEiOiJjbG5kcDUxcm4wNzZ5MmltbjdldmhtODg5In0.T4uW0nekNUbIzLEfg6INNA"
      map-style="mapbox://styles/mapbox/satellite-streets-v12"
      style="height: 400px"
      :center="[0, 0]"
      :zoom="1"
    >
      <MapboxNavigationControl />
      <MapboxMarker
        v-for="process in processes"
        :key="process.timestamp"
        :lng-lat="[
          process.location.geometry.coordinates.long,
          process.location.geometry.coordinates.lat,
        ]"
        :popup="{
          offset: [0, -30],
          closeButton: false,
          anchor: 'bottom',
        }"
      >
        <template v-slot:popup>
          <div class="text-subtitle1">{{ getProcessLabel(process) }}</div>
          <div class="text-caption">
            {{
              DateTime.fromSeconds(process.timestamp).toLocaleString(
                DateTime.DATETIME_MED_WITH_SECONDS
              )
            }}
          </div>
          <a href="#" @click.prevent="emit('showProcess', process.timestamp)"
            >Go to details</a
          >
          <q-icon name="arrow_right" />
        </template>
        <template v-slot:default>
          <q-avatar
            :icon="getProcessIcon(process)"
            color="white"
            text-color="black"
          />
        </template>
      </MapboxMarker>
    </MapboxMap>
  </div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapboxMap,
  MapboxNavigationControl,
  MapboxMarker,
} from '@studiometa/vue-mapbox-gl';
import { Process, SaleProcess } from 'src/models';
import { computed } from 'vue';
import { getProcessIcon, getProcessLabel } from './utils';
import { DateTime } from 'luxon';
import FoodDataBanner from './FoodDataBanner.vue';

const props = defineProps<{
  data: SaleProcess;
}>();

const emit = defineEmits<{
  showProcess: [timestamp: number];
}>();

const processes = computed(() => [props.data, ...findProcesses(props.data)]);

function findProcesses(process: Process): Process[] {
  return [
    process,
    ...process.inputInstances
      .map((inputInstance) =>
        typeof inputInstance.instance === 'object' &&
        'process' in inputInstance.instance &&
        inputInstance.instance.process !== undefined
          ? findProcesses(inputInstance.instance.process)
          : []
      )
      .flat(),
  ];
}
</script>
