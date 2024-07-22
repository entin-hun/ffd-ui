<template>
  <FoodDataBanner icon="map">Map of Activities</FoodDataBanner>
  <div class="q-pa-md">
    <MapboxMap
      :accessToken="mapboxAccessToken"
      map-style="mapbox://styles/mapbox/satellite-streets-v12"
      style="height: 400px"
      :center="[0, 0]"
      :zoom="1"
      @mb-load="mapLoaded"
    >
      <MapboxNavigationControl />
      <MapboxMarker
        v-for="process in processes"
        :key="process.timestamp"
        :lng-lat="[
          process.facility.location.coordinates[0],
          process.facility.location.coordinates[1],
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
      <MapboxLayer
        v-for="transport in transports"
        :key="transport.id"
        :options="transport.layer"
        :id="transport.id"
      />
    </MapboxMap>
  </div>
</template>

<script setup lang="ts">
import 'mapbox-gl/dist/mapbox-gl.css';
import {
  MapboxMap,
  MapboxNavigationControl,
  MapboxMarker,
  MapboxLayer,
} from '@studiometa/vue-mapbox-gl';
import type {
  Process,
  ProductInstance,
  TransportMethod,
} from '@fairfooddata/types';
import { computed } from 'vue';
import { getProcessIcon, getProcessLabel, getTransportLabel } from './utils';
import { DateTime } from 'luxon';
import FoodDataBanner from './FoodDataBanner.vue';
import GeoJSON from 'geojson';
import MapboxGl from 'mapbox-gl';
import { colors } from 'quasar';

const props = defineProps<{
  data: ProductInstance;
}>();

const emit = defineEmits<{
  showProcess: [timestamp: number];
}>();

const processes = computed(() => findProcesses(props.data));

const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

function findProcesses(instance: ProductInstance): Process[] {
  return 'process' in instance && instance.process !== undefined
    ? [
        instance.process,
        ...instance.process.inputInstances
          .map((inputInstance) =>
            typeof inputInstance.instance === 'object' &&
            'process' in inputInstance.instance &&
            inputInstance.instance.process !== undefined
              ? findProcesses(inputInstance.instance)
              : []
          )
          .flat(),
      ]
    : [];
}

function mapLoaded({ target }: { target: MapboxGl.Map }) {
  // technique based on https://jsfiddle.net/2mws8y3q/
  // an array of valid line-dasharray values, specifying the lengths of the alternating dashes and gaps that form the dash pattern
  const dashArraySequence = [
    [0, 4, 3],
    [0.5, 4, 2.5],
    [1, 4, 2],
    [1.5, 4, 1.5],
    [2, 4, 1],
    [2.5, 4, 0.5],
    [3, 4, 0],
    [0, 0.5, 3, 3.5],
    [0, 1, 3, 3],
    [0, 1.5, 3, 2.5],
    [0, 2, 3, 2],
    [0, 2.5, 3, 1.5],
    [0, 3, 3, 1],
    [0, 3.5, 3, 0.5],
  ];

  let step = 0;

  function animateDashArray(timestamp: number) {
    // Update line-dasharray using the next value in dashArraySequence. The
    // divisor in the expression `timestamp / 50` controls the animation speed.
    const newStep = Math.floor((timestamp / 50) % dashArraySequence.length);
    if (newStep !== step) {
      transports.value.forEach((transport) => {
        target.setPaintProperty(
          transport.id,
          'line-dasharray',
          dashArraySequence[step]
        );
      });
      step = newStep;
    }
    // Request the next frame of the animation.
    requestAnimationFrame(animateDashArray);
  }

  // start the animation
  requestAnimationFrame(animateDashArray);
}

interface InstanceTransport {
  from: GeoJSON.Position;
  to: GeoJSON.Position;
  cargo: string;
  method: TransportMethod;
}

interface TransportLayer {
  id: string;
  layer: MapboxGl.AnyLayer;
}

const transports = computed((): TransportLayer[] =>
  getTransports(props.data).map<TransportLayer>((transport) => ({
    id: transport.cargo,
    layer: {
      id: `layer-${transport.cargo}`,
      type: 'line',
      source: {
        type: 'geojson',
        data: {
          type: 'FeatureCollection',
          features: [
            {
              type: 'Feature',
              properties: {},
              geometry: {
                coordinates: [transport.from, transport.to],
                type: 'LineString',
              },
            },
          ],
        },
      },
      paint: {
        'line-color': colors.getPaletteColor(
          getTransportLabel(transport.method).color
        ),
        'line-width': 6,
        'line-opacity': 0.8,
      },
    },
  }))
);

function getTransports(instance: ProductInstance): InstanceTransport[] {
  return (
    instance.category === 'food' && instance.process !== undefined
      ? instance.process.inputInstances.map((inputInstance) =>
          typeof inputInstance.instance === 'object' &&
          'category' in inputInstance.instance &&
          inputInstance.instance.category === 'food' &&
          inputInstance.instance.process !== undefined
            ? [
                {
                  from: inputInstance.instance.process.facility.location
                    .coordinates,
                  to: instance.process?.facility.location.coordinates,
                  cargo: inputInstance.instance.type,
                  method:
                    'transport' in inputInstance
                      ? inputInstance.transport.method
                      : undefined,
                } as InstanceTransport,
                ...getTransports(inputInstance.instance),
              ]
            : undefined
        )
      : []
  )
    .flat()
    .filter(
      (transport): transport is InstanceTransport => transport !== undefined
    );
}
</script>
