import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import groupBy from 'lodash/groupBy';
import uniqBy from 'lodash/uniqBy';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
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
const FRONTEND_FILTERED_FIELDS = [ 'provinces', 'sector' ];

const findOption = (options, value) =>
  options && options.find(o => o.value === value || o.name === value);

const getQuery = ({ location }) => location && location.query || null;
const getLocale = ({ location }) =>
  location && location.payload && location.payload.locale;
const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;
const getWBData = ({ WorldBank }) => WorldBank.data[COUNTRY_ISO] || null;
const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data || null;

const getCalculationData = createSelector([ getWBData ], data => {
  if (!data || !data.length) return null;
  return groupBy(data, 'year');
});

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
  breakBy: findOption(
    BREAK_BY_OPTIONS,
    `provinces-${METRIC_OPTIONS.ABSOLUTE_VALUE.value}`
  ),
  provinces: ALL_SELECTED_OPTION,
  sector: ALL_SELECTED_OPTION,
  gas: ALL_SELECTED_OPTION
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  if (queryValue === ALL_SELECTED) return ALL_SELECTED_OPTION;
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);
  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
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
  if (!options || !options.breakBy) return null;
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

const getLegendDataOptions = createSelector(
  [ getModelSelected, getFilterOptions ],
  (modelSelected, options) => {
    if (!options || !modelSelected || !options[modelSelected]) return null;
    return options[modelSelected];
  }
);

const getLegendDataSelected = createSelector(
  [ getModelSelected, getSelectedOptions, getFilterOptions ],
  (modelSelected, selectedOptions, options) => {
    if (
      !selectedOptions ||
        !modelSelected ||
        !selectedOptions[modelSelected] ||
        !options
    )
      return null;
    if (
      !isArray(selectedOptions[modelSelected]) &&
        selectedOptions[modelSelected].value === ALL_SELECTED
    ) {
      return options[modelSelected];
    }
    const dataSelected = selectedOptions[modelSelected];
    return isArray(dataSelected) ? dataSelected : [ dataSelected ];
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected, getModelSelected, getMetricSelected ],
  (legendDataSelected, modelSelected, metricSelected) => {
    if (!legendDataSelected || !metricSelected) return null;
    const getYOption = columns =>
      columns.map(d => ({
        label: d.label,
        value: getYColumnValue(`${modelSelected}${d.value}`)
      }));
    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const getYearValues = (emissionsData, calculationData, metricSelected) => {
  const yearValues = emissionsData.map(d => d.year);
  if (
    calculationData &&
      metricSelected.value !== METRIC_OPTIONS.ABSOLUTE_VALUE.value
  ) {
    return intersection(
      yearValues,
      Object.keys(calculationData || []).map(y => parseInt(y, 10))
    );
  }
  return yearValues;
};

const getDFilterValue = (d, modelSelected) =>
  modelSelected === 'provinces' ? d.location : d[modelSelected];

const parseChartData = createSelector(
  [
    getEmissionsData,
    getMetricSelected,
    getModelSelected,
    getCalculationData,
    getYColumnOptions,
    getSelectedOptions
  ],
  (
    emissionsData,
    metricSelected,
    modelSelected,
    calculationData,
    yColumnOptions,
    selectedOptions
  ) =>
    {
      if (
        !emissionsData ||
          isEmpty(emissionsData) ||
          !metricSelected ||
          !yColumnOptions
      )
        return null;
      const [ data ] = emissionsData;
      const yearValues = getYearValues(
        data.emissions,
        calculationData,
        metricSelected
      );
      const API_DATA_SCALE = 1000000;
      const fieldsToFilter = difference(FRONTEND_FILTERED_FIELDS, [
        modelSelected
      ]);
      const dataParsed = [];
      yearValues.forEach(x => {
        const yItems = {};
        emissionsData.forEach(d => {
          const columnObject = yColumnOptions.find(
            c => c.label === getDFilterValue(d, modelSelected)
          );
          const yKey = columnObject && columnObject.value;
          // TODO: This might give problems with the I18n as works with the label and not value
          const fieldPassesFilter = (
            selectedFilterOption,
            field,
            dataToFilter
          ) =>
            isArray(selectedFilterOption)
              ? selectedFilterOption
                .map(o => o.label)
                .includes(getDFilterValue(dataToFilter, field))
              : selectedFilterOption.value === ALL_SELECTED ||
                selectedFilterOption.label === getDFilterValue(d, field);

          const dataPassesFilter = fieldsToFilter.every(
            field => fieldPassesFilter(selectedOptions[field], field, d)
          );

          if (yKey && dataPassesFilter) {
            const yData = d.emissions.find(e => e.year === x);
            const calculationRatio = getMetricRatio(
              metricSelected,
              calculationData,
              x
            );
            if (yData && yData.value) {
              yItems[yKey] = yData.value * API_DATA_SCALE / calculationRatio;
            }
          }
        });
        const item = { x, ...yItems };
        if (!isEmpty({ ...yItems })) dataParsed.push(item);
      });
      return dataParsed;
    }
);

export const getChartConfig = createSelector(
  [
    getEmissionsData,
    getLegendDataSelected,
    getModelSelected,
    getMetricSelected
  ],
  (data, legendDataSelected, modelSelected, metricSelected) => {
    if (!data || isEmpty(data) || !legendDataSelected || !metricSelected)
      return null;
    const getYOption = columns =>
      columns.map(d => ({
        label: d.label,
        value: getYColumnValue(`${modelSelected}${d.value}`)
      }));
    const yColumnOptions = uniqBy(getYOption(legendDataSelected), 'value');
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

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata.ghg.loading || GHGEmissions.loading;

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

export const getChartData = createStructuredSelector({
  data: parseChartData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected
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
  fieldToBreakBy: getModelSelected,
  filterOptions: getFilterOptions,
  query: getQuery,
  locale: getLocale,
  emissionParams: getEmissionParams,
  chartData: getChartData
});
