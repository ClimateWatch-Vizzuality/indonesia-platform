import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import {
  ALL_SELECTED,
  TOP_10_EMITTERS,
  METRIC_OPTIONS,
  METRIC_API_FILTER_NAMES,
  API_TARGET_DATA_SCALE
} from 'constants/constants';

import {
  DEFAULT_AXES_CONFIG,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

import {
  getEmissionsData,
  getTargetEmissionsData,
  getMetadata,
  getTop10EmitterSplittedOptions
} from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions,
  getModelSelected,
  getMetricSelected
} from './historical-emissions-filter-selectors';

const { COUNTRY_ISO } = process.env;
const FRONTEND_FILTERED_FIELDS = [ 'provinces', 'sector' ];

const getUnit = createSelector([ getMetadata, getMetricSelected ], (
  meta,
  metric
) =>
  {
    if (!meta || !metric) return null;
    const { metric: metrics } = meta;
    const metricObject = metrics &&
      metrics.find(m => METRIC_API_FILTER_NAMES[metric] === m.label);
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

const getLegendDataOptions = createSelector(
  [ getModelSelected, getFilterOptions ],
  (modelSelected, options) => {
    if (!options || !modelSelected || !options[modelSelected]) return null;
    return options[modelSelected];
  }
);

const getLegendDataSelected = createSelector(
  [
    getModelSelected,
    getSelectedOptions,
    getFilterOptions,
    getTop10EmitterSplittedOptions
  ],
  (modelSelected, selectedOptions, options, top10SplittedOptions) => {
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
      if (dataSelected.label === TOP_10_EMITTERS) return top10SplittedOptions;
    }
    return isArray(dataSelected) ? dataSelected : [ dataSelected ];
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected, getModelSelected ],
  (legendDataSelected, modelSelected) => {
    if (!legendDataSelected) return null;
    const getYOption = columns =>
      columns &&
        columns.map(d => ({
          label: d && d.label,
          value: d && getYColumnValue(`${modelSelected}${d.value}`)
        }));
    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const getDFilterValue = (d, modelSelected) =>
  modelSelected === 'provinces' ? d.location : d[modelSelected];

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
      const dataFilteredByMetric = emissionsData.filter(
        d => d.metric === METRIC_API_FILTER_NAMES[metricSelected]
      );
      const dataParsed = [];
      yearValues.forEach(x => {
        const yItems = {};
        dataFilteredByMetric.forEach(d => {
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

          const dataPassesFilter = FRONTEND_FILTERED_FIELDS.every(
            field => fieldPassesFilter(selectedOptions[field], field, d)
          );

          if (yKey && dataPassesFilter) {
            const yData = d.emissions.find(e => e.year === x);
            if (yData && yData.value) {
              yItems[yKey] = yData.value * scale;
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
    getMetricSelected,
    getTargetEmissionsData,
    getCorrectedUnit,
    getYColumnOptions
  ],
  (data, metricSelected, targetEmissionsData, unit, yColumnOptions) => {
    if (!data || isEmpty(data) || !metricSelected) return null;
    const tooltip = getTooltipConfig(yColumnOptions);
    const theme = getThemeConfig(yColumnOptions);
    colorCache = { ...colorCache, ...theme };
    const axes = {
      ...DEFAULT_AXES_CONFIG,
      yLeft: { ...DEFAULT_AXES_CONFIG.yLeft, unit }
    };
    const projectedConfig = {
      projectedColumns: [
        { label: 'BAU', color: '#113750' },
        { label: 'Quantified', color: '#ffc735' },
        { label: 'Not Quantifiable', color: '#b1b1c1' }
      ],
      projectedLabel: {}
    };

    const config = {
      axes,
      theme,
      tooltip,
      animation: false,
      columns: { x: [ { label: 'year', value: 'x' } ], y: yColumnOptions }
    };
    const hasTargetEmissions = targetEmissionsData &&
      !isEmpty(targetEmissionsData) &&
      metricSelected === METRIC_OPTIONS.ABSOLUTE_VALUE.value;
    return hasTargetEmissions ? { ...config, ...projectedConfig } : config;
  }
);

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata && metadata.ghg.loading || GHGEmissions && GHGEmissions.loading;

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

const parseTargetEmissionsData = createSelector(
  [ getTargetEmissionsData, getMetricSelected ],
  (targetEmissionsData, metricSelected) => {
    if (
      !targetEmissionsData ||
        isEmpty(targetEmissionsData) ||
        !metricSelected ||
        metricSelected !== METRIC_OPTIONS.ABSOLUTE_VALUE.value
    )
      return null;
    const countryData = targetEmissionsData.filter(
      d => d.location === COUNTRY_ISO
    );
    const parsedTargetEmissions = [];
    countryData.forEach(d => {
      if (d.sector === 'Total') {
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

export const getChartData = createStructuredSelector({
  data: parseChartData,
  projectedData: parseTargetEmissionsData,
  config: getChartConfig,
  loading: getDataLoading,
  dataOptions: getLegendDataOptions,
  dataSelected: getLegendDataSelected
});
