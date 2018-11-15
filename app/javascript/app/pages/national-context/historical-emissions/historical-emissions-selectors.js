import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import intersection from 'lodash/intersection';
import {
  ALL_SELECTED,
  ALL_SELECTED_OPTION,
  METRIC_OPTIONS
} from 'constants/constants';
import {
  DEFAULT_AXES_CONFIG,
  getMetricRatio,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

const { COUNTRY_ISO } = process.env;

const findOption = (options, value) =>
  options && options.find(o => o.value === value || o.name === value);

const getQuery = ({ location }) => location && location.query || null;
const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
const getWBData = ({ WorldBank }) => WorldBank.data[COUNTRY_ISO] || null;
const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata.ghg.loading || GHGEmissions.loading;

const getCalculationData = createSelector([ getWBData ], data => {
  if (!data || !data.length) return null;
  return groupBy(data, 'year');
});

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'Area', value: 'area' },
  { label: 'Line', value: 'line' }
];
const BREAK_BY_OPTIONS = [
  { label: 'Province - Absolute', value: 'province-absolute' },
  { label: 'Province - Per GDP', value: 'province-gdp' },
  { label: 'Province - Per Capita', value: 'province-capita' },
  { label: 'Sector - Absolute', value: 'sector-absolute' },
  { label: 'Sector - Per GDP', value: 'sector-gdp' },
  { label: 'Sector - Per Capita', value: 'sector-capita' },
  { label: 'Gas - Absolute', value: 'gas-absolute' },
  { label: 'Gas - Per GDP', value: 'gas-gdp' },
  { label: 'Gas - Per Capita', value: 'gas-capita' }
];

const getFieldOptions = field => createSelector(getMetadata, metadata => {
  if (!metadata || !metadata[field]) return null;
  return field === 'dataSource'
    ? metadata[field]
      .concat({ label: 'CAIT', value: '100' })
      .map(o => ({ name: o.label, value: String(o.value) }))
    : metadata[field].map(o => ({ label: o.label, value: String(o.value) }));
});

const getFilterOptions = createStructuredSelector({
  source: getFieldOptions('dataSource'),
  chartType: () => CHART_TYPE_OPTIONS,
  breakBy: () => BREAK_BY_OPTIONS,
  provinces: getFieldOptions('location'),
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector(getFilterOptions, options => ({
  source: findOption(options.source, 'SIGN SMART'),
  chartType: findOption(CHART_TYPE_OPTIONS, 'line'),
  breakBy: findOption(BREAK_BY_OPTIONS, 'province-absolute'),
  provinces: ALL_SELECTED_OPTION,
  sector: ALL_SELECTED_OPTION,
  gas: ALL_SELECTED_OPTION
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  return queryValue === ALL_SELECTED
    ? ALL_SELECTED_OPTION
    : findOption(getFilterOptions(state)[field], queryValue);
};

const getSelectedOptions = createStructuredSelector({
  source: getFieldSelected('source'),
  chartType: getFieldSelected('chartType'),
  breakBy: getFieldSelected('breakBy'),
  provinces: getFieldSelected('provinces'),
  sector: getFieldSelected('sector'),
  gas: getFieldSelected('gas')
});

// CHART DATA
const getBreakBySelected = createSelector(getSelectedOptions, options => {
  if (!options || !options.source) return null;
  const breakByArray = options.breakBy.value.split('-');
  return { modelSelected: breakByArray[0], metricSelected: breakByArray[1] };
});

const getModelSelected = createSelector(
  getBreakBySelected,
  breakBySelected => breakBySelected && breakBySelected.modelSelected || null
);
const getMetricSelected = createSelector(
  getBreakBySelected,
  breakBySelected => breakBySelected && breakBySelected.metricSelected || null
);

export const parseChartData = createSelector(
  [ getEmissionsData, getMetricSelected, getCalculationData ],
  (emissionsData, metricSelected, calculationData) => {
    if (!emissionsData || isEmpty(emissionsData) || !metricSelected)
      return null;
    const [ data ] = emissionsData;
    let xValues = data.emissions.map(d => d.year);
    const API_DATA_SCALE = 1000000;
    if (
      calculationData &&
        metricSelected.value !== METRIC_OPTIONS.ABSOLUTE_VALUE.value
    ) {
      xValues = intersection(
        xValues,
        Object.keys(calculationData || []).map(y => parseInt(y, 10))
      );
    }
    const dataParsed = xValues.map(x => {
      const yItems = {};
      emissionsData.forEach(d => {
        const yKey = getYColumnValue(d.sector);
        const yData = d.emissions.find(e => e.year === x);
        const calculationRatio = getMetricRatio(
          metricSelected.value,
          calculationData,
          x
        );
        if (yData && yData.value) {
          yItems[yKey] = yData.value * API_DATA_SCALE / calculationRatio;
        }
      });
      const item = { x, ...yItems };
      return item;
    });
    return dataParsed;
  }
);

const getDataOptions = createSelector([ getModelSelected, getFilterOptions ], (
  modelSelected,
  options
) =>
  {
    if (!options || !modelSelected) return null;
    return options[modelSelected] || null;
  });

const getDataSelected = createSelector(
  [ getModelSelected, getSelectedOptions ],
  (modelSelected, selectedOptions) => {
    if (!selectedOptions || !modelSelected) return null;
    return selectedOptions[modelSelected] || null;
  }
);

export const getChartConfig = createSelector(
  [ getEmissionsData, getSelectedOptions, getMetricSelected ],
  (data, selectedOptions, metricSelected) => {
    if (!data || isEmpty(data) || !metricSelected) return null;
    const { sector, gas } = selectedOptions;
    const getLabels = field =>
      field && (isArray(field) ? field.map(s => s.label) : field.label);
    const sectorSelectedLabels = getLabels(sector);
    const gasSelectedLabels = getLabels(gas);
    const getYOption = columns =>
      columns.map(d => ({ label: d.sector, value: getYColumnValue(d.sector) }));
    let yColumns = data;
    if (gasSelectedLabels !== ALL_SELECTED)
      yColumns = yColumns.filter(s => gasSelectedLabels.includes(s.gas));
    if (sectorSelectedLabels !== ALL_SELECTED)
      yColumns = yColumns.filter(s => sectorSelectedLabels.includes(s.sector));
    const yColumnOptions = uniqBy(getYOption(yColumns), 'value');
    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);
    let { unit } = DEFAULT_AXES_CONFIG.yLeft;
    if (metricSelected.value === METRIC_OPTIONS.PER_GDP.value) {
      unit = `${unit}/ million $ GDP`;
    } else if (metricSelected.value === METRIC_OPTIONS.PER_CAPITA.value) {
      unit = `${unit} per capita`;
    }
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit }
    };
    return {
      axes,
      theme,
      tooltip,
      animation: false,
      columns: { x: [ { label: 'year', value: 'x' } ], y: yColumnOptions }
    };
  }
);

export const getChartData = createStructuredSelector({
  data: parseChartData,
  config: getChartConfig,
  loading: getChartLoading,
  dataOptions: getDataOptions,
  dataSelected: getDataSelected
});

// GHG PARAMS
const getParam = (fieldName, data) => {
  if (!data) return {};
  if (!isArray(data) && data.value !== ALL_SELECTED)
    return { [fieldName]: data.value };
  if (isArray(data)) return { [fieldName]: data.map(f => f.value).join() };
  return {};
};

export const getEmissionParams = createSelector(
  [ getSelectedOptions ],
  options => {
    if (!options || !options.source) return null;
    const { source: selectedSource, gas } = options;
    return {
      location: COUNTRY_ISO,
      ...getParam('gas', gas),
      source: selectedSource.value
    };
  }
);

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams,
  chartData: getChartData
});
