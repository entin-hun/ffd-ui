<template>
  <FoodDataBanner icon="info">Details</FoodDataBanner>
  <div class="q-pa-md">
    <q-tree :nodes="nodes" node-key="key" ref="tree" @after-show="openDone">
      <template v-slot:default-header="prop">
        <div :id="`tree-node-${prop.node.key}`">
          <div class="row items-center">
            <q-icon
              :name="prop.node.icon"
              :color="prop.node.iconColor"
              class="q-pr-sm"
            />
            <div>{{ prop.node.label }}</div>
          </div>
        </div>
      </template>
    </q-tree>
  </div>
</template>

<script setup lang="ts">
import { QTree, QTreeNode } from 'quasar';
import {
  Process,
  ProductInstance,
  FoodInstance,
  IDs,
  CartridgeInstance,
  Transport,
  LocalInputInstance,
  TemperatureRange,
  TransportedInputInstance,
  UrlOr,
  MachineInstance,
  Hr,
  Impact,
  KnowHow,
  SaleProcess,
} from '../models';
import { DateTime, Duration } from 'luxon';
import { Ref, computed, onMounted, ref } from 'vue';
import { getProcessIcon, getProcessLabel, getTransportLabel } from './utils';
import FoodDataBanner from './FoodDataBanner.vue';

let keyCounter = 0;

const props = defineProps<{
  data: SaleProcess;
}>();

const openProcess = (processId: number) => {
  if (tree.value === undefined) return;

  if (findProcess(tree.value.nodes[0], processId)) openingProcess = processId;
};

defineExpose({ openProcess });

function findProcess(node: QTreeNode, id: number): boolean {
  if (
    node.key === id ||
    node.children?.some((child) => findProcess(child, id))
  ) {
    tree.value?.setExpanded(node.key, true);
    return true;
  }

  return false;
}

// function needsExpand(): boolean {

// }

let openingProcess: number | undefined;

function openDone() {
  if (openingProcess === undefined || tree.value === undefined) return;

  const node = tree.value.getNodeByKey(openingProcess);
  const element = node
    ? document.getElementById(`tree-node-${node.key}`)
    : undefined;
  if (element != undefined) element.scrollIntoView({ behavior: 'smooth' });

  openingProcess = undefined;
}

const tree: Ref<InstanceType<typeof QTree> | undefined> = ref();

function addNodesIds(node: QTreeNode): QTreeNode {
  return {
    key: keyCounter++,
    ...node,
    children: node.children?.map((child) => addNodesIds(child)),
  };
}

onMounted(() => expandNodes());

function expandNodes() {
  tree.value?.setExpanded(nodes.value[0].key, true);
  nodes.value[0].children?.forEach((child) => {
    if (child.children !== undefined && child.children.length > 0)
      tree.value?.setExpanded(child.key, true);
  });
}

const nodes = computed(() => processToNodes(props.data).map(addNodesIds));

function processToNodes<T extends Process>(process?: T): QTreeNode[] {
  if (process === undefined) return [];

  const basicInfo = {
    label: getProcessLabel(process),
    icon: getProcessIcon(process),
    key: process.timestamp,
  };

  switch (process.type) {
    case 'harvest':
      return [
        {
          ...basicInfo,
          children: [
            locationToNode(process.location),
            timestampToNode(process.timestamp),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
    case 'sale':
      return [
        {
          ...basicInfo,
          children: [
            locationToNode(process.location),
            {
              label: `Price: ${new Intl.NumberFormat('en-US', {
                style: 'currency',
                currency: process.price.currency,
                minimumFractionDigits: 2,
                maximumFractionDigits: 2,
              }).format(process.price.amount)}`,
              icon: 'paid',
            },
            ...inputInstancesToNodes(process.inputInstances),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
    case 'printing':
      return [
        {
          ...basicInfo,
          children: [
            machineInstanceToNode(process.machineInstance),
            locationToNode(process.location),
            knowHowToNode(process.knowHow),
            {
              label: `Shape: ${process.shape}`,
              icon: 'interests',
            },
            timestampToNode(process.timestamp),
            ...durationToNodes(process.duration),
            temperatureRangeToNode(process.temperatureRange),
            ...inputInstancesToNodes(process.inputInstances),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
    case 'blending':
      return [
        {
          ...basicInfo,
          children: [
            machineInstanceToNode(process.machineInstance),
            locationToNode(process.location),
            knowHowToNode(process.knowHow),
            timestampToNode(process.timestamp),
            ...durationToNodes(process.duration),
            temperatureRangeToNode(process.temperatureRange),
            ...inputInstancesToNodes(process.inputInstances),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
    case 'milling':
      return [
        {
          ...basicInfo,
          children: [
            machineInstanceToNode(process.machineInstance),
            locationToNode(process.location),
            knowHowToNode(process.knowHow),
            timestampToNode(process.timestamp),
            ...durationToNodes(process.duration),
            temperatureRangeToNode(process.temperatureRange),
            ...inputInstancesToNodes(process.inputInstances),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
    case 'freezedrying':
      return [
        {
          ...basicInfo,
          children: [
            machineInstanceToNode(process.machineInstance),
            locationToNode(process.location),
            knowHowToNode(process.knowHow),
            timestampToNode(process.timestamp),
            ...durationToNodes(process.duration),
            temperatureRangeToNode(process.temperatureRange),
            ...inputInstancesToNodes(process.inputInstances),
            ...outputInstancesToNodes(process.impacts),
          ],
        },
      ];
  }
}

function outputInstancesToNodes(outputInstances?: Impact[]): QTreeNode[] {
  return outputInstances !== undefined
    ? outputInstances.map((outputInstance) =>
        outputInstanceToNode(outputInstance)
      )
    : [];
}

const outputInstanceIconMap: Map<string, string> = new Map([
  ['water', 'water'],
  ['carbon', 'factory'],
]);

function outputInstanceToNode(outputInstance: Impact): QTreeNode {
  return {
    label: outputInstance.category,
    icon: outputInstanceIconMap.get(outputInstance.category),
    children: [
      ...ownerIdToNodes(outputInstance.ownerId),
      {
        label: `Format: ${outputInstance.format}`,
        icon: 'category',
      },
      ...quantityToNodes(outputInstance.quantity),
    ],
  };
}

function machineInstanceToNode(machine: MachineInstance): QTreeNode {
  return {
    label: machine.category,
    icon: 'settings',
    children: [
      ...ownerIdToNodes(machine.ownerId),
      ...providersDomainToNodes(machine.providerSDomain),
      ...quantityToNodes(machine.quantity),
      ...sizeToNodes(machine.size),
      ...hrToNodes(machine.hr),
    ],
  };
}

function knowHowToNode(recipe: KnowHow): QTreeNode {
  return {
    label: 'Know-How',
    icon: 'format_list_numbered',
    children: [
      {
        label: `Owner: ${recipe.owner}`,
        icon: 'copyright',
      },
      {
        label: `Inputs: ${recipe.inputs}`,
        icon: 'exit_to_app',
      },
      {
        label: `Outputs: ${recipe.outputs}`,
        icon: 'output',
      },
    ],
  };
}

function hrToNodes(hr: Hr): QTreeNode[] {
  return [
    {
      label: `Tasks: ${hr.tasks}`,
      icon: 'task',
      children: [
        {
          label: hr.assignee,
          icon: 'person',
        },
      ],
    },
  ];
}

function locationToNode(location: GeoJSON.Point): QTreeNode {
  return {
    label: `Location: [${location.coordinates[0]}, ${location.coordinates[1]}]`,
    icon: 'location_on',
  };
}

function timestampToNode(timestamp: number): QTreeNode {
  return {
    label: `Time: ${DateTime.fromSeconds(timestamp).toLocaleString(
      DateTime.DATETIME_MED_WITH_SECONDS
    )}`,
    icon: 'access_time',
  };
}

function durationToNodes(duration?: number): QTreeNode[] {
  return duration !== undefined
    ? [
        {
          label: `Duration: ${Duration.fromObject({
            seconds: duration,
          })
            .rescale()
            .toHuman()}`,
          icon: 'timelapse',
        },
      ]
    : [];
}

function temperatureRangeToNode(range: TemperatureRange): QTreeNode {
  return {
    label: `Temperature range: ${range.min}—${range.max} °C`,
    icon: 'thermostat',
  };
}

function inputInstancesToNodes(
  inputInstances: (LocalInputInstance | TransportedInputInstance)[]
) {
  return inputInstances
    .map((inputInstance) =>
      'transport' in inputInstance
        ? instanceToNodes(
            inputInstance.instance,
            inputInstance.quantity,
            inputInstance.transport
          )
        : instanceToNodes(inputInstance.instance, inputInstance.quantity)
    )
    .flat();
}

function transportToNode(transport: Transport): QTreeNode {
  return {
    label: `Shipping: ${transport.method}`,
    icon: getTransportLabel(transport.method).icon,
    children: [
      timestampToNode(transport.deparetureTime),
      ...durationToNodes(transport.duration),
      {
        label: `Fuel: ${transport.fuelType}`,
        icon: 'local_gas_station',
      },
      {
        label: `Share: ${transport.weight * 100}%`,
        icon: 'percent',
      },
    ],
  };
}

function instanceToNodes(
  instance: UrlOr<ProductInstance>,
  quantity: number,
  transport?: Transport
): QTreeNode[] {
  return instance === undefined
    ? []
    : typeof instance === 'string'
    ? [
        {
          label: `Unresolved URL: ${instance}`,
          icon: 'tag',
        },
      ]
    : 'errorMessage' in instance
    ? [
        {
          label: instance.errorMessage,
          icon: 'error_outline',
          iconColor: 'red',
        },
      ]
    : [
        ...(instance.category === 'food'
          ? [foodInstanceToNode(instance, quantity, transport)]
          : instance.category === 'cartridge'
          ? [cartridgeInstanceToNode(instance, quantity, transport)]
          : []),
      ];
}

function foodInstanceToNode(
  food: FoodInstance,
  quantity: number,
  transport?: Transport
): QTreeNode {
  return {
    label: food.type,
    icon: 'restaurant',
    children: [
      ...ownerIdToNodes(food.ownerId),
      ...expiryDateToNodes(food.expiryDate),
      ...(food.format !== undefined
        ? [
            {
              label: `Format: ${food.format}`,
              icon: 'category',
            },
          ]
        : []),
      ...bioToNodes(food.bio),
      ...quantityToNodes(quantity),
      ...gradeToNodes(food.grade),
      ...sizeToNodes(food.size),
      ...fdcIdToNodes(food.iDs),
      ...(transport !== undefined ? [transportToNode(transport)] : []),
      ...processToNodes(food.process),
    ],
  };
}

function cartridgeInstanceToNode(
  cartridge: CartridgeInstance,
  quantity: number,
  transport?: Transport
): QTreeNode {
  return {
    label: 'Cartridge',
    icon: 'change_history',
    children: [
      ...ownerIdToNodes(cartridge.ownerId),
      ...bioToNodes(cartridge.bio),
      ...quantityToNodes(quantity),
      ...gradeToNodes(cartridge.grade),
      ...sizeToNodes(cartridge.size),
      ...(transport !== undefined ? [transportToNode(transport)] : []),
    ],
  };
}

function ownerIdToNodes(domain?: string): QTreeNode[] {
  return domain !== undefined
    ? [
        {
          label: `Owner: ${domain}`,
          icon: 'copyright',
        },
      ]
    : [];
}

function providersDomainToNodes(domain?: string): QTreeNode[] {
  return domain !== undefined
    ? [{ label: `Provider: ${domain}`, icon: 'copyright' }]
    : [];
}

function expiryDateToNodes(expiryDate?: number): QTreeNode[] {
  return expiryDate !== undefined
    ? [
        {
          label: `Expiry date: ${DateTime.fromSeconds(
            expiryDate
          ).toLocaleString(DateTime.DATETIME_MED_WITH_SECONDS)}`,
          icon: 'alarm_off',
        },
      ]
    : [];
}

function bioToNodes(bio?: boolean): QTreeNode[] {
  return bio !== undefined
    ? [
        {
          label: `Bio: ${bio ? 'yes' : 'no'}`,
          icon: 'apple',
        },
      ]
    : [];
}

function quantityToNodes(quantity?: number): QTreeNode[] {
  return quantity !== undefined
    ? [
        {
          label: `Quantity: ${quantity}`,
          icon: 'scale',
        },
      ]
    : [];
}

function gradeToNodes(grade?: string): QTreeNode[] {
  return grade !== undefined
    ? [
        {
          label: `Grade: ${grade}`,
          icon: 'grade',
        },
      ]
    : [];
}

function sizeToNodes(size?: string): QTreeNode[] {
  return size !== undefined
    ? [
        {
          label: `Size: ${size}`,
          icon: 'open_in_full',
        },
      ]
    : [];
}

function fdcIdToNodes(id?: IDs): QTreeNode[] {
  return id !== undefined
    ? [
        {
          label: `${id.registry} ID: ${id.id}`,
          icon: 'fingerprint',
        },
      ]
    : [];
}
</script>
