import { Process, TransportMethod } from 'src/models';

export const chartColors = [
  'chart-1',
  'chart-2',
  'chart-3',
  'chart-4',
  'chart-5',
  'chart-6',
  'chart-7',

  // '#00cccc',
  // '#33ff00',
  // '#006666',
  // '#00FFFF',
  // '#3366ff',
  // '#0000ff',
  // '#cc00ff',
  // 'red',
  // 'pink',
  // 'purple',
  // 'deep-purple',
  // 'indigo',
  // 'blue',
  // 'light-blue',
  // 'cyan',
  // 'teal',
  // 'green',
  // 'light-green',
  // 'lime',
  // 'yellow',
  // 'amber',
  // 'orange',
  // 'deep-orange',
  // 'brown',
];

interface ProcessLabel {
  icon: string;
  text: string;
}

const processTypeLabels: Map<string, ProcessLabel> = new Map([
  ['sale', { icon: 'sell', text: 'Sold to you' }],
  ['printing', { icon: 'print', text: '3D Printing' }],
  ['blending', { icon: 'blender', text: 'Blending' }],
  ['milling', { icon: 'deblur', text: 'Milling' }],
  ['freezedrying', { icon: 'ac_unit', text: 'Freeze-drying' }],
  ['harvest', { icon: 'agriculture', text: 'Harvesting' }],
]);

export function getProcessIcon(process: Process) {
  return 'type' in process
    ? processTypeLabels.get(process.type)?.icon || 'question_mark'
    : 'bug_report';
}

export function getProcessLabel(process: Process) {
  return 'type' in process
    ? processTypeLabels.get(process.type)?.text || 'Unknown process'
    : 'BUG: Process with no type';
}

export interface TransportMeta {
  icon: string;
  color: string;
}

const transportMeta: Map<TransportMethod, TransportMeta> = new Map([
  ['air', { icon: 'flight', color: 'white' }],
  ['land', { icon: 'local_shipping', color: 'brown' }],
  ['sea', { icon: 'directions_boat', color: 'blue' }],
]);

export function getTransportLabel(method?: TransportMethod): TransportMeta {
  return (
    (method !== undefined ? transportMeta.get(method) : undefined) || {
      icon: 'question_mark',
      color: 'primary',
    }
  );
}
