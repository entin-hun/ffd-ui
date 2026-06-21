<template>
  <FoodDataBanner icon="map">Map of Activities</FoodDataBanner>
  <div class="q-pa-md">
    <MapboxMap
      :accessToken="mapboxAccessToken"
      map-style="mapbox://styles/mapbox/satellite-streets-v12"
      style="height: 400px"
      :center="mapCenter"
      :zoom="mapZoom"
      @mb-load="mapLoaded"
    >
      <MapboxNavigationControl />
      <MapboxMarker
        v-for="entry in processEntries"
        :key="`${entry.process.timestamp}-${entry.ownerId ?? ''}-${entry.instanceType ?? ''}`"
        :lng-lat="[
          entry.process.site.location.coordinates[0],
          entry.process.site.location.coordinates[1],
        ]"
        :popup="{
          offset: [0, -30],
          closeButton: false,
          anchor: 'bottom',
        }"
      >
        <template v-slot:popup>
          <div class="text-subtitle1">{{ getProcessLabel(entry.process) }}</div>
          <div class="text-caption">
            {{ formatTimestamp(entry.process.timestamp) }}
          </div>
          <div class="popup-actions row items-center no-wrap q-gutter-sm">
            <a href="#" @click.prevent="emit('showProcess', entry.process.timestamp)"
              >Go to details</a
            >
            <q-icon name="arrow_right" />
            <q-btn
              dense
              round
              flat
              size="sm"
              color="primary"
              icon="search"
              aria-label="Open in Google Maps"
              :href="buildGoogleMapsUrl(entry)"
              target="_blank"
              rel="noopener noreferrer"
            />
          </div>
        </template>
        <template v-slot:default>
          <div class="marker-pin">
            <q-avatar
              :icon="getProcessIcon(entry.process)"
              color="white"
              text-color="black"
              class="marker-avatar"
            />
          </div>
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
  Site,
} from '@trace.market/types';
import { computed, ref, onMounted } from 'vue';
import {
  formatTimestamp,
  getProcessIcon,
  getProcessLabel,
  getTransportLabel,
} from './utils';
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

interface ProcessEntry {
  process: Process;
  ownerId?: string;
  instanceType?: string;
}

const processEntries = computed(() => findProcessEntries(props.data));

const mapboxAccessToken = process.env.MAPBOX_ACCESS_TOKEN;

const mapCenter = ref<[number, number]>([0, 0]);
const mapZoom = ref(1);

onMounted(() => {
  if ('geolocation' in navigator) {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        mapCenter.value = [position.coords.longitude, position.coords.latitude];
        mapZoom.value = 4;
      },
      () => {
        // Fallback to default if user denies or error occurs
        mapCenter.value = [0, 0];
        mapZoom.value = 1;
      }
    );
  }
});

function findProcessEntries(instance: ProductInstance): ProcessEntry[] {
  return 'process' in instance && instance.process !== undefined
    ? [
        {
          process: instance.process,
          ownerId:
            'ownerId' in instance && typeof instance.ownerId === 'string'
              ? instance.ownerId
              : undefined,
          instanceType:
            'type' in instance && typeof instance.type === 'string'
              ? instance.type
              : undefined,
        },
        ...instance.process.inputInstances
          .map((inputInstance) =>
            typeof inputInstance.instance === 'object' &&
            'process' in inputInstance.instance &&
            inputInstance.instance.process !== undefined
              ? findProcessEntries(inputInstance.instance)
              : []
          )
          .flat(),
      ]
    : [];
}

function getSiteName(site: Site): string {
  const raw = (site as { name?: string; label?: string }).name ??
    (site as { name?: string; label?: string }).label;
  return typeof raw === 'string' && raw.trim().length > 0
    ? raw
    : 'Unnamed Facility';
}

function buildGoogleMapsUrl(entry: ProcessEntry): string {
  const [lng, lat] = entry.process.site.location.coordinates;
  if (!Number.isFinite(lng) || !Number.isFinite(lat)) {
    return 'https://www.google.com/maps';
  }

  const queryText = [
    getSiteName(entry.process.site),
    entry.ownerId,
    entry.instanceType,
  ]
    .filter((value): value is string => typeof value === 'string' && value.length > 0)
    .join(' ');

  const params = new URLSearchParams();
  params.set('q', queryText || `${lat},${lng}`);
  params.set('ll', `${lat},${lng}`);
  params.set('z', '15');

  return `https://www.google.com/maps?${params.toString()}`;
}

function mapLoaded({ target }: { target: MapboxGl.Map }) {
  // Switch to globe projection and enable atmospheric fog for 3D look
  target.setProjection('globe');
  target.setFog({
    color: 'rgba(255,255,255,0.4)', // soften brightness of fog glow
    'horizon-blend': 0.05, // reduce blend to limit white wash at horizon
    range: [0.8, 6], // start fog a bit farther and cap density sooner
    'star-intensity': 0.1, // lower star glow in night view
  });

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
                  from: inputInstance.instance.process.site.location
                    .coordinates,
                  to: instance.process?.site.location.coordinates,
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

<style scoped>
.marker-pin {
  position: relative;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.marker-avatar {
  width: 40px;
  height: 40px;
}

.popup-actions {
  margin-top: 2px;
}
</style>
