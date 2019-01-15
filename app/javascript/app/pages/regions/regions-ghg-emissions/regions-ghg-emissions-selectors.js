import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import { ALL_SELECTED, API_TARGET_DATA_SCALE } from 'constants/constants';

import { getProvince } from 'selectors/provinces-selectors';
import { getTranslate } from 'selectors/translation-selectors';

import {
  DEFAULT_AXES_CONFIG,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

const SOURCE = 'SIGN SMART';
const FRONTEND_FILTERED_FIELDS = [ 'gas', 'sector', 'metric' ];

const getQuery = ({ location }) => location && (location.query || null);

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data;

const getSource = createSelector(getMetadata, meta => {
  if (!meta || !meta.dataSource) return null;
  const selected = meta.dataSource.find(source => source.label === SOURCE);
  return selected && selected.value;
});

const findOption = (
  options,
  value,
  findBy = [ 'name', 'value', 'code', 'label' ]
) =>
  options && options
      .filter(o => o)
      .find(
        o => castArray(findBy).some(key => String(o[key]) === String(value))
      );

export const getAllSelectedOption = createSelector([ getTranslate ], t => ({
  value: ALL_SELECTED,
  label: t('common.all-selected-option'),
  override: true
}));

const getFieldOptions = field => createSelector([ getMetadata ], metadata => {
  if (!metadata || !metadata[field]) return null;

  return metadata[field]
    .map(o => ({ label: o.label, value: String(o.value), code: o.code }))
    .filter(o => o);
});

export const getFilterOptions = createStructuredSelector({
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas'),
  metric: getFieldOptions('metric')
});

// DEFAULTS
const getDefaults = createSelector([ getFilterOptions, getAllSelectedOption ], (
  options,
  allSelectedOption
) => ({
  sector: allSelectedOption,
  gas: allSelectedOption,
  metric: options && options.metric && options.metric[0]
}));

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

export const getSelectedOptions = createStructuredSelector({
  metric: getFieldSelected('metric'),
  sector: getFieldSelected('sector'),
  gas: getFieldSelected('gas')
});

export const getEmissionParams = createSelector([ getSource, getProvince ], (
  source,
  location
) =>
  {
    if (!source) return null;
    return { location, source };
  });

// DATA
const getUnit = createSelector([ getMetadata, getFieldSelected('metric') ], (
  meta,
  metric
) =>
  {
    if (!meta || !metric) return null;
    const { metric: metrics } = meta;
    const metricObject = metrics && metrics.find(m => metric.code === m.code);
    return metricObject && metricObject.unit;
  });

export const getScale = createSelector([ getUnit ], unit => {
  if (!unit) return null;
  if (unit.startsWith('kt')) return 1000;
  return 1;
});

const getCorrectedUnit = createSelector([ getUnit, getScale ], (unit, scale) =>
  {
    if (!unit || !scale) return null;
    return unit.replace('kt', 't');
  });

const getLegendDataOptions = getFieldOptions('sector');

const getLegendDataSelected = createSelector(
  [ getFieldOptions('sector'), getFieldSelected('sector') ],
  (sectors, selectedSector) => {
    if (!sectors || !selectedSector) return null;

    if (selectedSector.value === ALL_SELECTED) return sectors;

    return castArray(selectedSector);
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected ],
  legendDataSelected => {
    if (!legendDataSelected) return null;

    return legendDataSelected.map(d => ({
      ...d,
      value: getYColumnValue(d.value)
    }));
  }
);

const filterBySelectedOptions = (emissionsData, selectedOptions) => {
  const fieldPassesFilter = (selectedFilterOption, field, data) =>
    castArray(selectedFilterOption).some(
      o => o.value === ALL_SELECTED || o.code === data[field]
    );

  return emissionsData.filter(
    d =>
      FRONTEND_FILTERED_FIELDS.every(
        field => fieldPassesFilter(selectedOptions[field], field, d)
      )
  );
};

const parseChartData = createSelector(
  [
    getEmissionsData,
    getYColumnOptions,
    getSelectedOptions,
    getCorrectedUnit,
    getScale
  ],
  (emissionsData, yColumnOptions, selectedOptions, unit, scale) => {
    if (!emissionsData || isEmpty(emissionsData) || !yColumnOptions)
      return null;

    const yearValues = emissionsData[0].emissions.map(d => d.year);

    const filteredData = filterBySelectedOptions(
      emissionsData,
      selectedOptions
    );

    const dataParsed = [];
    yearValues.forEach(x => {
      const yItems = {};
      filteredData.forEach(d => {
        const columnObject = yColumnOptions.find(c => c.code === d.sector);
        const yKey = columnObject && columnObject.value;

        if (yKey) {
          const yData = d.emissions.find(e => e.year === x);
          if (yData && yData.value) {
            yItems[yKey] = (yItems[yKey] || 0) + yData.value * scale;
          }
        }
      });
      const item = { x, ...yItems };
      if (!isEmpty({ ...yItems })) dataParsed.push(item);
    });
    return dataParsed;
  }
);

let colorCache = {};

export const getChartConfig = createSelector(
  [
    getEmissionsData,
    getTargetEmissionsData,
    getCorrectedUnit,
    getYColumnOptions,
    getTranslate
  ],
  (data, targetEmissionsData, unit, yColumnOptions, t) => {
    if (!data || isEmpty(data)) return null;
    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);
    colorCache = { ...theme, ...colorCache };
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit }
    };
    const targetLabels = t(
      'pages.national-context.historical-emissions.target-labels',
      { default: {} }
    );

    const projectedConfig = {
      projectedColumns: [
        { label: targetLabels.bau, color: '#113750' },
        { label: targetLabels.quantified, color: '#ffc735' },
        { label: targetLabels['not-quantifiable'], color: '#b1b1c1' }
      ],
      projectedLabel: {}
    };

    const config = {
      axes,
      theme: colorCache,
      tooltip,
      animation: false,
      columns: { x: [ { label: 'year', value: 'x' } ], y: yColumnOptions }
    };

    return { ...config, ...projectedConfig };
  }
);

const parseTargetEmissionsData = createSelector(
  [ getTargetEmissionsData, getProvince ],
  (targetEmissionsData, provinceISO) => {
    if (!targetEmissionsData || isEmpty(targetEmissionsData)) return null;

    const countryData = targetEmissionsData.filter(
      d => d.location === provinceISO
    );
    const parsedTargetEmissions = [];
    countryData.forEach(d => {
      if (d.sector === 'TOTAL') {
        parsedTargetEmissions.push({
          x: d.year,
          y: d.value * API_TARGET_DATA_SCALE,
          label: d.label
        });
      }
    });

    return parsedTargetEmissions;
  }
);

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata && metadata.ghg.loading || GHGEmissions && GHGEmissions.loading;

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

export const getChartData = createStructuredSelector({
  data: parseChartData,
  projectedData: parseTargetEmissionsData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected
});

export const getGHGEmissions = createStructuredSelector({
  chartData: getChartData,
  emissionParams: getEmissionParams,
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  allSelectedOption: getAllSelectedOption,
  provinceISO: getProvince,
  t: getTranslate
});