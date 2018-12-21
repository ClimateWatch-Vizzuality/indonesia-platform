import { createStructuredSelector, createSelector } from 'reselect';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import sortBy from 'lodash/sortBy';
import take from 'lodash/take';
import { ALL_SELECTED } from 'constants/constants';

import { getTranslate } from 'selectors/translation-selectors';

import {
  getMetadata,
  getEmissionsData,
  getDefaultTop10EmittersOption,
  getTop10EmitterSplittedOptions,
  getQuery
} from './historical-emissions-get-selectors';

const findOption = (options, value) => {
  const findBy = [ 'name', 'value', 'code', 'label' ];

  return options &&
    options.find(o => findBy.some(key => String(o[key]) === String(value)));
};

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'area', value: 'area' },
  { label: 'line', value: 'line' }
];

const getBreakByOptions = createSelector([ getTranslate ], t => {
  const options = t('pages.national-context.historical-emissions.break-by') ||
    {};
  return Object
    .keys(options)
    .map(optionKey => ({ label: options[optionKey], value: optionKey }));
});

export const getAllSelectedOption = createSelector([ getTranslate ], t => ({
  value: ALL_SELECTED,
  label: t('common.all-selected-option'),
  override: true
}));

const getFieldOptions = field => createSelector(getMetadata, metadata => {
  if (!metadata || !metadata[field]) return null;
  if (field === 'dataSource') {
    return metadata[field].map(o => ({
      name: o.label,
      value: String(o.value)
    }));
  }
  if (field === 'location') {
    return metadata[field].map(o => ({
      label: o.label,
      value: String(o.value),
      code: o.iso_code3
    }));
  }
  return metadata[field].map(o => ({
    label: o.label,
    value: String(o.value),
    code: o.code
  }));
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
  [
    getDefaultTop10EmittersOption,
    getSectorSelected,
    getEmissionsData,
    getMetadata
  ],
  (defaultTop10, sectorSelected, data, meta) => {
    if (!data || isEmpty(data) || !sectorSelected || !meta || !meta.location)
      return defaultTop10;
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
    if (top10.length !== 10) return defaultTop10;
    const getLocationValuesforNames = names => {
      const value = names
        .map(name => findOption(meta.location, name).value)
        .join();
      return value;
    };

    return {
      label: defaultTop10.label,
      value: getLocationValuesforNames(top10),
      override: true
    };
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
  breakBy: getBreakByOptions,
  provinces: addExtraOptions('location'),
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector(
  [
    getFilterOptions,
    getBreakByOptions,
    getTop10EmitterSplittedOptions,
    getAllSelectedOption
  ],
  (options, breakByOptions, top10EmmmitersOptions, allSelectedOption) => ({
    source: findOption(options.source, 'SIGN SMART'),
    chartType: findOption(CHART_TYPE_OPTIONS, 'line'),
    breakBy: findOption(breakByOptions, 'provinces-absolute'),
    provinces: top10EmmmitersOptions,
    sector: allSelectedOption,
    gas: allSelectedOption
  })
);

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = String(query[field]);
  if (queryValue === ALL_SELECTED) return getAllSelectedOption(state);
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);
  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

const filterSectorSelectedByMetrics = createSelector(
  [
    getFieldSelected('sector'),
    getFieldOptions('sector'),
    getFieldSelected('breakBy')
  ],
  (sectorSelected, sectorOptions, breakBy) => {
    if (!sectorOptions || !breakBy) return null;
    if (!breakBy.value.endsWith('absolute')) {
      return sectorOptions.find(o => o.code === 'TOTAL') || sectorSelected;
    }
    return sectorSelected;
  }
);

export const getSelectedOptions = createStructuredSelector({
  source: getFieldSelected('source'),
  chartType: getFieldSelected('chartType'),
  breakBy: getFieldSelected('breakBy'),
  provinces: getFieldSelected('provinces'),
  sector: filterSectorSelectedByMetrics,
  gas: getFieldSelected('gas')
});

const getBreakBySelected = createSelector(getSelectedOptions, options => {
  if (!options || !options.breakBy) return null;
  const breakByArray = options.breakBy.value.split('-');
  return { modelSelected: breakByArray[0], metricSelected: breakByArray[1] };
});

export const getModelSelected = createSelector(
  getBreakBySelected,
  breakBySelected => breakBySelected && breakBySelected.modelSelected || null
);
export const getMetricSelected = createSelector(
  getBreakBySelected,
  breakBySelected => breakBySelected && breakBySelected.metricSelected || null
);
