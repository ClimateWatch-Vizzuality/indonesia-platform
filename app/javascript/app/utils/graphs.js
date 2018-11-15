import upperFirst from 'lodash/upperFirst';
import camelCase from 'lodash/camelCase';
import { METRIC_OPTIONS } from 'constants/constants';

export const DEFAULT_AXES_CONFIG = {
  xBottom: { name: 'Year', unit: 'date', format: 'YYYY' },
  yLeft: { name: 'Emissions', unit: 'CO<sub>2</sub>e', format: 'number' }
};

export const getColumns = data =>
  Object.keys(data[0]).map(d => ({ label: data[0][d].label, value: d }));

export const getColumnValue = column => upperFirst(camelCase(column));
export const getYColumnValue = column => `y${getColumnValue(column)}`;

export const getTooltipConfig = columns => {
  const tooltip = {};
  columns.forEach(column => {
    tooltip[column.value] = { label: column.label };
  });
  return tooltip;
};

export const getMetricRatio = (selected, calculationData, x) => {
  if (!calculationData || !calculationData[x]) return 1;
  if (selected === METRIC_OPTIONS.PER_GDP.value) {
    // GDP is in dollars and we want to display it in million dollars
    return calculationData[x][0].gdp / 1000000;
  }
  if (selected === METRIC_OPTIONS.PER_CAPITA.value) {
    return calculationData[x][0].population;
  }
  return 1;
};

export const CHART_COLORS = [
  '#00B4D2',
  '#0677B3',
  '#D2187C',
  '#FFB400',
  '#FF7800',
  '#FF88AA',
  '#AB0000',
  '#20D5B7',
  '#383F45',
  '#CACCD0',
  '#80DAE9',
  '#93BBD9',
  '#E98CBE',
  '#FFDA80',
  '#FFBC80',
  '#FFC4D5',
  '#D58080',
  '#90EADB',
  '#9C9FA2',
  '#E5E6E8'
];

export const getThemeConfig = (columns, colors = CHART_COLORS) => {
  const theme = {};
  columns.forEach((column, i) => {
    const index = column.index || i;
    const correctedIndex = index < colors.length
      ? index
      : index - colors.length;
    theme[column.value] = {
      stroke: colors[correctedIndex],
      fill: colors[correctedIndex]
    };
  });
  return theme;
};
