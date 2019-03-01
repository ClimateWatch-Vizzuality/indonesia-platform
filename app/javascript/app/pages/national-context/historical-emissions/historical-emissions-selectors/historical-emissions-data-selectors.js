import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import castArray from 'lodash/castArray';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {
  ALL_SELECTED,
  METRIC_OPTIONS,
  METRIC,
  API_TARGET_DATA_SCALE,
  SECTOR_TOTAL
} from 'constants/constants';

import {
  DEFAULT_AXES_CONFIG,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

import { getTranslate } from 'selectors/translation-selectors';
import {
  getEmissionsData,
  getTargetEmissionsData,
  getMetadata,
  getMetadataData
} from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getModelSelected,
  getMetricSelected
} from './historical-emissions-filter-selectors';

const { COUNTRY_ISO } = process.env;
const FRONTEND_FILTERED_FIELDS = [ 'region', 'sector' ];

const getUnit = createSelector([ getMetadataData, getMetricSelected ], (
  meta,
  metric
) =>
  {
    if (!meta || !metric) return null;
    const { metric: metrics } = meta;
    const metricObject = metrics &&
      metrics.find(m => METRIC[metric] === m.code);
    return metricObject && metricObject.unit;
  });

export const getScale = createSelector([ getUnit ], unit => {
  if (!unit) return null;
  if (unit.startsWith('kt')) return 1000;
  if (unit.startsWith('Mt')) return 1000000;
  return 1;
});

const getCorrectedUnit = createSelector([ getUnit, getScale ], (unit, scale) =>
  {
    if (!unit || !scale) return null;
    return unit.replace('kt', 't').replace('Mt', 't');
  });

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

    const dataSelected = selectedOptions[modelSelected];
    if (!isArray(dataSelected)) {
      if (dataSelected.value === ALL_SELECTED) return options[modelSelected];
    }
    return isArray(dataSelected) ? dataSelected : [ dataSelected ];
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected, getMetricSelected, getModelSelected ],
  (legendDataSelected, metricSelected, modelSelected) => {
    if (!legendDataSelected) return null;
    const removeTotalSector = d =>
      modelSelected !== 'sector' ||
        metricSelected !== 'absolute' ||
        modelSelected === 'sector' && d.code !== SECTOR_TOTAL;
    const getYOption = columns =>
      columns &&
        columns
          .map(d => ({
            label: d && d.label,
            value: d && getYColumnValue(`${modelSelected}${d.value}`),
            code: d && (d.code || d.label)
          }))
          .filter(removeTotalSector);
    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const getDFilterValue = (d, modelSelected) =>
  modelSelected === 'region' ? d.iso_code3 : d[modelSelected];

const isOptionSelected = (selectedOptions, valueOrCode) =>
  castArray(selectedOptions)
    .filter(o => o)
    .some(o => o.value === valueOrCode || o.code === valueOrCode);
const filterBySelectedOptions = (
  emissionsData,
  metricSelected,
  modelSelected,
  selectedOptions
) =>
  {
    const fieldPassesFilter = (selectedFilterOption, fieldValue) =>
      isOptionSelected(selectedFilterOption, ALL_SELECTED) ||
        isOptionSelected(selectedFilterOption, fieldValue);
    const absoluteMetric = METRIC.absolute;

    const byMetric = d => {
      const notTotalWithAbsoluteMetric = d.metric === absoluteMetric &&
        d.sector !== SECTOR_TOTAL;

      return d.metric === METRIC[metricSelected] &&
        (notTotalWithAbsoluteMetric || d.metric !== absoluteMetric);
    };

    return emissionsData
      .filter(byMetric)
      .filter(
        d =>
          FRONTEND_FILTERED_FIELDS.every(
            field =>
              fieldPassesFilter(
                selectedOptions[field],
                getDFilterValue(d, field)
              )
          )
      );
  };

const parseChartData = createSelector(
  [
    getEmissionsData,
    getMetricSelected,
    getModelSelected,
    getYColumnOptions,
    getSelectedOptions,
    getCorrectedUnit,
    getScale
  ],
  (
    emissionsData,
    metricSelected,
    modelSelected,
    yColumnOptions,
    selectedOptions,
    unit,
    scale
  ) =>
    {
      if (
        !emissionsData ||
          isEmpty(emissionsData) ||
          !metricSelected ||
          !yColumnOptions
      )
        return null;

      const yearValues = emissionsData[0].emissions.map(d => d.year);

      const filteredData = filterBySelectedOptions(
        emissionsData,
        metricSelected,
        modelSelected,
        selectedOptions
      );

      const dataParsed = [];
      yearValues.forEach(x => {
        const yItems = {};
        filteredData.forEach(d => {
          const columnObject = yColumnOptions.find(
            c => c.code === getDFilterValue(d, modelSelected)
          );
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

const parseTargetEmissionsData = createSelector(
  [
    getTargetEmissionsData,
    getSelectedOptions,
    getModelSelected,
    getMetricSelected
  ],
  (targetEmissionsData, selectedOptions, modelSelected, metricSelected) => {
    if (isEmpty(targetEmissionsData)) return null;
    if (metricSelected !== METRIC_OPTIONS.ABSOLUTE_VALUE) return null;
    if (!selectedOptions) return null;
    if (!isOptionSelected(selectedOptions.region, COUNTRY_ISO)) return null;
    if (
      isOptionSelected(selectedOptions.chartType, 'line') &&
        modelSelected === 'sector' &&
        (selectedOptions.sector.value === ALL_SELECTED ||
          isArray(selectedOptions.sector))
    )
      return null;

    const countryData = targetEmissionsData.filter(
      d => d.location === COUNTRY_ISO
    );
    const targetSectors = modelSelected === 'sector' &&
      selectedOptions.sector.value !== ALL_SELECTED
      ? castArray(selectedOptions.sector).map(s => s.code)
      : [ 'TOTAL' ];

    const targetEmissions = [];

    countryData.forEach(d => {
      // if (d.sector === targetSector) {
      if (targetSectors.includes(d.sector)) {
        const target = targetEmissions.find(
          t => t.x === d.year && t.label === d.label
        ) ||
          { x: d.year, y: 0, label: d.label };
        const newTarget = target.y === 0;
        target.y += d.value * API_TARGET_DATA_SCALE;

        if (newTarget) targetEmissions.push(target);
      }
    });

    return targetEmissions;
  }
);

const getProjectedChartConfig = createSelector(
  [ parseTargetEmissionsData, getTranslate ],
  (targetEmissionsData, t) => {
    if (isEmpty(targetEmissionsData)) return {};

    const targetLabels = t(
      'pages.national-context.historical-emissions.target-labels',
      { default: {} }
    );

    return {
      projectedColumns: [
        { label: targetLabels.bau, color: '#113750' },
        { label: targetLabels.quantified, color: '#ffc735' },
        { label: targetLabels['not-quantifiable'], color: '#b1b1c1' }
      ],
      projectedLabel: {}
    };
  }
);

export const getChartConfig = createSelector(
  [
    getEmissionsData,
    getMetricSelected,
    getProjectedChartConfig,
    getCorrectedUnit,
    getYColumnOptions,
    getTranslate
  ],
  (data, metricSelected, projectedConfig, unit, yColumnOptions) => {
    if (!data || isEmpty(data) || !metricSelected) return null;
    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);
    colorCache = { ...theme, ...colorCache };
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit }
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

const getGHGEmissions = ({ GHGEmissions = {} }) => GHGEmissions;
const getChartLoading = createSelector(
  [ getMetadata, getGHGEmissions ],
  (metadata, ghgEmissions) =>
    metadata && metadata.loading || ghgEmissions && ghgEmissions.loading
);

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
