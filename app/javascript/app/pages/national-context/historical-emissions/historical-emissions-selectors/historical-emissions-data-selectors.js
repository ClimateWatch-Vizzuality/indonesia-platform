import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import isEmpty from 'lodash/isEmpty';
import uniqBy from 'lodash/uniqBy';
import groupBy from 'lodash/groupBy';
import uniq from 'lodash/uniq';
import intersection from 'lodash/intersection';
import difference from 'lodash/difference';
import {
  ALL_SELECTED,
  TOP_10_EMMITERS,
  METRIC_OPTIONS,
  API_DATA_SCALE
} from 'constants/constants';

import {
  DEFAULT_AXES_CONFIG,
  getMetricRatio,
  getThemeConfig,
  getYColumnValue,
  getTooltipConfig
} from 'utils/graphs';

import {
  getEmissionsData,
  getTargetEmissionsData,
  getWBData
} from './historical-emissions-get-selectors';
import {
  getSelectedOptions,
  getFilterOptions
} from './historical-emissions-filter-selectors';

const getCalculationData = createSelector([ getWBData ], data => {
  if (!data || !data.length) return null;
  return groupBy(data, 'year');
});

const { COUNTRY_ISO } = process.env;
const FRONTEND_FILTERED_FIELDS = [ 'provinces', 'sector' ];

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
        (selectedOptions[modelSelected].value === ALL_SELECTED ||
          selectedOptions[modelSelected].value === TOP_10_EMMITERS)
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
        label: d && d.label,
        value: d && getYColumnValue(`${modelSelected}${d.value}`)
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
          const top10ProvinceEmmiters = [];
          // Top 10 province emmiter values
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
                selectedFilterOption.value === TOP_10_EMMITERS &&
                  top10ProvinceEmmiters.includes(getDFilterValue(d, field)) ||
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
    getMetricSelected,
    getTargetEmissionsData
  ],
  (
    data,
    legendDataSelected,
    modelSelected,
    metricSelected,
    targetEmissionsData
  ) =>
    {
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
        !isEmpty(targetEmissionsData);
      return hasTargetEmissions ? { ...config, ...projectedConfig } : config;
    }
);

const getChartLoading = ({ metadata = {}, GHGEmissions = {} }) =>
  metadata.ghg.loading || GHGEmissions.loading;

const getDataLoading = createSelector(
  [ getChartLoading, parseChartData ],
  (loading, data) => loading || !data || false
);

const parseTargetEmissionsData = createSelector(
  [ getTargetEmissionsData, getMetricSelected, getCalculationData ],
  (targetEmissionsData, metricSelected, calculationData) => {
    if (!targetEmissionsData || isEmpty(targetEmissionsData) || !metricSelected)
      return null;
    const countryData = targetEmissionsData.filter(
      d => d.location === COUNTRY_ISO
    );
    const parsedTargetEmissions = [];
    const years = uniq(countryData.map(d => d.year));
    const calculationRatioByYear = {};
    years.forEach(y => {
      calculationRatioByYear[y] = getMetricRatio(
        metricSelected,
        calculationData,
        y
      );
    });
    countryData.forEach(d => {
      if (d.sector === 'Total') {
        const value = d.value * API_DATA_SCALE / calculationRatioByYear[d.year];
        parsedTargetEmissions.push({ x: d.year, y: value, label: d.label });
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
