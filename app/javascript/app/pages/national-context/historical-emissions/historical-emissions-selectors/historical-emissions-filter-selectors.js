import { createStructuredSelector, createSelector } from 'reselect';
import {
  ALL_SELECTED,
  ALL_SELECTED_OPTION,
  METRIC_OPTIONS
} from 'constants/constants';

import {
  getMetadata,
  getTop10EmittersOption
} from './historical-emissions-get-selectors';

const findOption = (options, value) =>
  options &&
    options.find(
      o =>
        String(o.value) === String(value) ||
          o.name === value ||
          o.label === value
    );

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'area', value: 'area' },
  { label: 'line', value: 'line' }
];
const BREAK_BY_OPTIONS = [
  {
    label: 'Province - Absolute',
    value: `provinces-${METRIC_OPTIONS.ABSOLUTE_VALUE.value}`
  },
  {
    label: 'Province - Per GDP',
    value: `provinces-${METRIC_OPTIONS.PER_GDP.value}`
  },
  {
    label: 'Province - Per Capita',
    value: `provinces-${METRIC_OPTIONS.PER_CAPITA.value}`
  },
  {
    label: 'Sector - Absolute',
    value: `sector-${METRIC_OPTIONS.ABSOLUTE_VALUE.value}`
  },
  {
    label: 'Sector - Per GDP',
    value: `sector-${METRIC_OPTIONS.PER_CAPITA.value}`
  },
  {
    label: 'Sector - Per Capita',
    value: `sector-${METRIC_OPTIONS.PER_GDP.value}`
  },
  {
    label: 'Gas - Absolute',
    value: `gas-${METRIC_OPTIONS.ABSOLUTE_VALUE.value}`
  },
  { label: 'Gas - Per GDP', value: `gas-${METRIC_OPTIONS.PER_GDP.value}` },
  { label: 'Gas - Per Capita', value: `gas-${METRIC_OPTIONS.PER_CAPITA.value}` }
];

const getFieldOptions = field => createSelector(getMetadata, metadata => {
  if (!metadata || !metadata[field]) return null;
  if (field === 'dataSource') {
    return metadata[field].map(o => ({ name: o.label, value: o.value }));
  }
  return metadata[field].map(o => ({ label: o.label, value: String(o.value) }));
});

const addExtraOptions = field =>
  createSelector([ getFieldOptions(field), getTop10EmittersOption ], (
    options,
    top10EmmmitersOption
  ) =>
    {
      if (!options) return null;
      if (field === 'dataSource') {
        // Remove when we have CAIT. Just for showcase purpose
        const fakeCAITOption = { name: 'CAIT', value: '100' };
        return options.concat(fakeCAITOption);
      }
      if (field === 'location') return [ top10EmmmitersOption, ...options ];
      return options;
    });

export const getFilterOptions = createStructuredSelector({
  source: addExtraOptions('dataSource'),
  chartType: () => CHART_TYPE_OPTIONS,
  breakBy: () => BREAK_BY_OPTIONS,
  provinces: addExtraOptions('location'),
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector(
  [ getFilterOptions, getTop10EmittersOption ],
  (options, top10EmmmitersOption) => ({
    source: findOption(options.source, 'SIGN SMART'),
    chartType: findOption(CHART_TYPE_OPTIONS, 'line'),
    breakBy: findOption(
      BREAK_BY_OPTIONS,
      `provinces-${METRIC_OPTIONS.ABSOLUTE_VALUE.value}`
    ),
    provinces: top10EmmmitersOption,
    sector: ALL_SELECTED_OPTION,
    gas: ALL_SELECTED_OPTION
  })
);

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = String(query[field]);
  if (queryValue === ALL_SELECTED) return ALL_SELECTED_OPTION;
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);
  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

export const getSelectedOptions = createStructuredSelector({
  source: getFieldSelected('source'),
  chartType: getFieldSelected('chartType'),
  breakBy: getFieldSelected('breakBy'),
  provinces: getFieldSelected('provinces'),
  sector: getFieldSelected('sector'),
  gas: getFieldSelected('gas')
});
