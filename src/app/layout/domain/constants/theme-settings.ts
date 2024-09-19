export type themeColor =
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

export type ThemeClass = `${themeColor}-light` | `${themeColor}-dark`;

export interface ThemeOption {
  light: {
    hex: `#${string}`;
    class: ThemeClass;
  };
  dark: {
    hex: `#${string}`;
    class: ThemeClass;
  };
  name: themeColor;
}

export const THEME_OPTIONS = [
  {
    value: '#7d00fa',
    label: 'Violeta',
  },
  {
    value: '#c00100',
    label: 'Rojo',
  },
  {
    value: '#026e00',
    label: 'Verde',
  },
  {
    value: '#343dff',
    label: 'Azul',
  },
  {
    value: '#626200',
    label: 'Amarillo',
  },
  {
    value: '#006a6a',
    label: 'Cyan',
  },
  {
    value: '#a900a9',
    label: 'Magenta',
  },
  {
    value: '#964900',
    label: 'Naranja',
  },
  {
    value: '#326b00',
    label: 'chartreuse',
  },
  {
    value: '#005cbb',
    label: 'azure',
  },
  {
    value: '#ba005c',
    label: 'rose',
  },
];
