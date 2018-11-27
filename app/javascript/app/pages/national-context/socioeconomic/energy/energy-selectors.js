import { createStructuredSelector, createSelector } from 'reselect';
import capitalize from 'lodash/capitalize';
import isArray from 'lodash/isArray';
import uniqBy from 'lodash/uniqBy';
import { getTranslation } from 'utils/translations';

import { getThemeConfig, getTooltipConfig } from 'utils/graphs';

import {
  getSectionsContent,
  getIndicators
} from '../population/population-selectors';

const { COUNTRY_ISO } = process.env;
const INDICATOR_CODE = 'supply_energy';
const INDICATOR_QUERY_NAME = 'energyInd';
const CATEGORIES_QUERY_NAME = 'categories';

export const AXES_CONFIG = {
  xBottom: { name: 'Year', unit: 'date', format: 'YYYY' },
  yLeft: { name: 'Energy supply', unit: 'GWh', format: 'number' }
};

const getTranslatedContent = createSelector([ getSectionsContent ], data => {
  if (!data) return null;

  const sectionSlug = 'energy';
  const indicatorsSlug = 'indicators-label';

  return {
    title: getTranslation(data, sectionSlug, 'title'),
    description: getTranslation(data, sectionSlug, 'description'),
    indicatorsLabel: getTranslation(data, indicatorsSlug, 'title')
  };
});

const getEnergyData = createSelector([ getIndicators ], indicators => {
  if (!indicators) return null;

  return indicators.values &&
    indicators.values.filter(
      ind =>
        ind.indicator_code === INDICATOR_CODE &&
          ind.location_iso_code3 === COUNTRY_ISO
    );
});

const getYears = createSelector([ getEnergyData ], energyData => {
  if (!energyData) return null;

  const valuesCollected = energyData.map(ind => ind.values);
  const years = valuesCollected[0].map(o => o.year);
  return years;
});

const getEnergyIndicator = createSelector([ getIndicators ], indicators => {
  if (!indicators) return null;

  return indicators &&
    indicators.indicators &&
    indicators.indicators.find(ind => ind.code === INDICATOR_CODE);
});

const getOptions = createSelector([ getEnergyIndicator ], energyIndicator => {
  if (!energyIndicator) return null;

  return [ { label: energyIndicator.name, value: energyIndicator.code } ];
});

const getCategories = createSelector([ getEnergyData ], energyData => {
  if (!energyData) return null;

  const categoriesOptions = [];
  energyData.forEach(
    d =>
      categoriesOptions.push({
        label: capitalize(d.category),
        value: d.category
      })
  );
  return categoriesOptions;
});

const getFilterOptions = createSelector([ getOptions, getCategories ], (
  options,
  categories
) => ({
  [INDICATOR_QUERY_NAME]: options,
  [CATEGORIES_QUERY_NAME]: categories
}));

const getDefaults = createSelector([ getOptions, getCategories ], (
  options,
  categories
) => ({
  [INDICATOR_QUERY_NAME]: options &&
    options.find(o => o.value === INDICATOR_CODE),
  [CATEGORIES_QUERY_NAME]: categories
}));

const findOption = (options, value) =>
  options && options.find(o => o.value === value || o.name === value);

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  const findSelectedOption = value => findOption(options, value);

  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

const getSelectedOptions = createStructuredSelector({
  [INDICATOR_QUERY_NAME]: getFieldSelected(INDICATOR_QUERY_NAME),
  [CATEGORIES_QUERY_NAME]: getFieldSelected(CATEGORIES_QUERY_NAME)
});

const getLegendDataSelected = createSelector(
  [ getSelectedOptions, getFilterOptions ],
  (selectedOptions, options) => {
    if (!selectedOptions || !options) return null;

    const dataSelected = selectedOptions[CATEGORIES_QUERY_NAME];

    return isArray(dataSelected) ? dataSelected : [ dataSelected ];
  }
);

const getYColumnOptions = createSelector(
  [ getLegendDataSelected ],
  legendDataSelected => {
    if (!legendDataSelected) return null;
    const getYOption = columns =>
      columns.map(d => ({ label: d && d.label, value: d && d.value }));

    return uniqBy(getYOption(legendDataSelected), 'value');
  }
);

const getChartData = createSelector(
  [
    getSelectedOptions,
    getEnergyData,
    getYears,
    getCategories,
    getYColumnOptions,
    getLegendDataSelected
  ],
  (
    selectedOptions,
    energyData,
    years,
    categories,
    yColumns,
    legendDataSelected
  ) =>
    {
      if (!selectedOptions || !energyData || !years || !categories || !yColumns)
        return null;

      const indicator = selectedOptions[INDICATOR_QUERY_NAME];

      const filteredEnergyDataByIndicator = energyData.filter(
        d => d.indicator_code === indicator.value
      );

      const selectedData = [];

      if (yColumns && filteredEnergyDataByIndicator && years) {
        years.forEach(year => {
          const dataForYear = { x: parseInt(year, 10) };
          yColumns.forEach(category => {
            const singleCategory = filteredEnergyDataByIndicator.find(
              e => e.category === category.value
            );
            if (singleCategory) {
              const categoryForYear = singleCategory.values.find(
                d => d.year === year
              );
              dataForYear[`y${capitalize(
                category.value
              )}`] = categoryForYear.value;
            }
          });
          selectedData.push(dataForYear);
        });
      }

      const configYColumns = yColumns.map(y => ({
        label: y.label,
        value: `y${capitalize(y.value)}`
      }));

      return {
        data: selectedData,
        domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
        config: {
          columns: { x: [ { label: 'year', value: 'x' } ], y: configYColumns },
          axes: AXES_CONFIG,
          theme: getThemeConfig(configYColumns),
          tooltip: getTooltipConfig(configYColumns),
          animation: false,
          yLabelFormat: value => `${value}%`
        },
        dataSelected: legendDataSelected,
        dataOptions: categories
      };
    }
);

export const getEnergy = createStructuredSelector({
  translations: getTranslatedContent,
  options: getOptions,
  years: getYears,
  chartData: getChartData,
  selectedOptions: getSelectedOptions
});
