export type ThemeColor =
  | 'violet'
  | 'red'
  | 'blue'
  | 'green'
  | 'yellow'
  | 'cyan'
  | 'orange'
  | 'magenta'
  | 'chartreuse'
  | 'azure'
  | 'rose';

export type ThemeClass = `${ThemeColor}-light` | `${ThemeColor}-dark`;

export interface ThemeOption {
  value: ThemeColor;
  color: string;
  label: string;
}

export const THEME_CLASSES: ThemeClass[] = [
  'violet-light',
  'violet-dark',
  'red-light',
  'red-dark',
  'green-light',
  'green-dark',
  'blue-light',
  'blue-dark',
  'yellow-light',
  'yellow-dark',
  'cyan-light',
  'cyan-dark',
  'magenta-light',
  'magenta-dark',
  'orange-light',
  'orange-dark',
  'chartreuse-light',
  'chartreuse-dark',
  'azure-light',
  'azure-dark',
  'rose-light',
  'rose-dark',
];

export const THEME_OPTIONS: ThemeOption[] = [
  {
    value: 'violet',
    color: '#7d00fa',
    label: 'Violeta',
  },
  {
    value: 'red',
    color: '#c00100',
    label: 'Rojo',
  },
  {
    value: 'blue',
    color: '#026e00',
    label: 'Azul',
  },
  {
    value: 'green',
    color: '#343dff',
    label: 'Verde',
  },
  {
    value: 'yellow',
    color: '#626200',
    label: 'Amarillo',
  },
  {
    value: 'cyan',
    color: '#006a6a',
    label: 'Cyan',
  },
  {
    value: 'orange',
    color: '#a900a9',
    label: 'Magenta',
  },
  {
    value: 'magenta',
    color: '#964900',
    label: 'Naranja',
  },
  {
    value: 'chartreuse',
    color: '#326b00',
    label: 'chartreuse',
  },
  {
    value: 'azure',
    color: '#005cbb',
    label: 'azure',
  },
  {
    value: 'rose',
    color: '#ba005c',
    label: 'rose',
  },
];
