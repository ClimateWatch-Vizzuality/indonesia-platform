import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import {
  ALL_SELECTED,
  ALL_SELECTED_OPTION,
  METRIC_OPTIONS
} from 'constants/constants';

import {
  getMetadata,
  getEmissionsData,
  getDefaultTop10EmittersOption,
  getQuery
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
    return metadata[field].map(o => ({
      name: o.label,
      value: String(o.value)
    }));
  }
  return metadata[field].map(o => ({ label: o.label, value: String(o.value) }));
});

// Only to calculate top 10 emitters option
const getSectorSelected = createSelector([ getQuery, getMetadata ], (
  query,
  metadata
) =>
  {
    if (!query || !metadata) return null;
    const sectorLabel = value => {
      const sectorObject = metadata.sector.find(s => String(s.value) === value);
      return sectorObject && sectorObject.label;
    };
    const { sector } = query;
    return !sector || sector === ALL_SELECTED
      ? ALL_SELECTED
      : sector.split(',').map(value => sectorLabel(value));
  });

export const getTop10EmittersOption = createSelector(
  [ getDefaultTop10EmittersOption, getSectorSelected, getEmissionsData ],
  (defaultTop10, sectorSelected, data) => {
    if (!data || isEmpty(data) || !sectorSelected) return defaultTop10;
    const selectedData = sectorSelected === ALL_SELECTED
      ? data
      : data.filter(d => sectorSelected.includes(d.sector));
    const groupedSelectedData = groupBy(selectedData, 'location');
    const provinces = [];
    Object.keys(groupedSelectedData).forEach(provinceName => {
      if (provinceName === 'Indonesia') return;
      const emissionsValue = groupedSelectedData[provinceName].reduce(
        (accumulator, p) => {
          const lastYearEmission = p.emissions[p.emissions.length - 1].value;
          return accumulator + lastYearEmission;
        },
        0
      );
      provinces.push({ name: provinceName, value: emissionsValue });
    });
    const top10 = take(sortBy(provinces, 'value').map(p => p.name), 10);
    return top10.length === 10 ? top10 : defaultTop10;
  }
);

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
