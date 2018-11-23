import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslation } from 'utils/translations';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';

const FIRST_CHART_INDICATOR_CODES = [
  'pop_total',
  'pop_growth',
  'lit_rate',
  'poor_people'
];

const getQuery = ({ location }) => location && location.query || null;

const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

const getIndicators = ({ indicators }) => indicators && indicators.data;

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    thousand: value => `${format('.2s')(`${value * 1000}`)}`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

// POPULATION CHARTS
const getNationalIndicators = createSelector(
  [ getIndicators ],
  nationalIndicators => {
    if (!nationalIndicators) return null;

    return nationalIndicators.values &&
      nationalIndicators.values.filter(ind => ind.location_iso_code3 === 'IDN');
  }
);

const getNationalIndicatorsForPopulation = createSelector(
  [ getNationalIndicators ],
  indicators => {
    if (!indicators) return null;

    return FIRST_CHART_INDICATOR_CODES.map(
      indCode => indicators.find(ind => ind.indicator_code === indCode)
    );
  }
);

const getNationalIndicatorsForPopulationOptions = createSelector(
  [ getIndicators ],
  indicators => {
    if (!indicators) return null;

    const options = [];

    FIRST_CHART_INDICATOR_CODES.forEach(indicatorCode => {
      const indicator = indicators &&
        indicators.indicators &&
        indicators.indicators.find(ind => ind.code === indicatorCode) ||
        null;
      if (indicator) {
        options.push({ label: indicator.name, value: indicator.code });
      }
    });

    return sortBy(options, 'label');
  }
);

const getProvinceIndicatorsForPopulationOptions = createSelector(
  [ getIndicators ],
  indicators => {
    if (!indicators) return null;

    const POPULATION_INDICATOR = 'pop_total';
    const options = [];

    const populationProvinces = indicators &&
      indicators.values &&
      indicators.values.filter(
        ind =>
          ind.location_iso_code3 !== 'IDN' &&
            ind.indicator_code === POPULATION_INDICATOR
      );

    if (populationProvinces) {
      populationProvinces.forEach(
        province =>
          options.push({ label: province.location, value: province.location })
      );
    }

    return sortBy(options, 'label');
  }
);

const getFilterOptions = createStructuredSelector({
  popNationalIndicator: getNationalIndicatorsForPopulationOptions,
  popProvince: getProvinceIndicatorsForPopulationOptions
});

const getDefaults = createSelector(getFilterOptions, options => ({
  popNationalIndicator: options.popNationalIndicator.find(
    o => o.value === 'pop_total'
  ),
  popProvince: options.popProvince.find(o => o.value === 'Aceh')
}));

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  return options.find(o => o.value === queryValue);
};

const getSelectedOptions = createStructuredSelector({
  popNationalIndicator: getFieldSelected('popNationalIndicator'),
  popProvince: getFieldSelected('popProvince')
});

const getFirstChartFilter = (queryName, selectedOptions) => {
  const label = selectedOptions[queryName] && selectedOptions[queryName].label;

  return [ { label } ];
};

const getBarChartData = createSelector(
  [ getIndicators, getNationalIndicatorsForPopulation, getSelectedOptions ],
  (data, indicators, selectedOptions) => {
    if (!indicators || !data) return null;

    const queryName = 'popNationalIndicator';

    const selectedIndicator = indicators.find(
      ind => ind.indicator_code === selectedOptions[queryName].value
    );

    const code = selectedIndicator && selectedIndicator.indicator_code;
    const indicator = data &&
      data.indicators &&
      data.indicators.find(ind => ind.code === code);
    const unit = indicator && indicator.unit;

    const selectedData = [];
    selectedIndicator.values.forEach(d => {
      if (d.value && d.year) {
        selectedData.push({ x: d.year, y: d.value });
      }
    });

    return {
      data: selectedData,
      domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
      config: {
        axes: {
          xBottom: { name: 'Years', unit: '', format: 'string' },
          yLeft: { name: 'Number of people', unit: '', format: 'number' }
        },
        tooltip: {
          y: {
            label: 'People',
            format: value => `${format(',.2r')(`${value * 1000}`)}`
          },
          x: { label: 'Year' },
          indicator: selectedOptions[queryName] &&
            selectedOptions[queryName].label
        },
        animation: false,
        columns: {
          x: [ { label: 'year', value: 'x' } ],
          y: [
            {
              label: selectedOptions[queryName] &&
                selectedOptions[queryName].label,
              value: 'y'
            }
          ]
        },
        theme: { y: { stroke: '#2EC9DF', fill: '#2EC9DF' } },
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: getFirstChartFilter(queryName, selectedOptions),
      dataSelected: getFirstChartFilter(queryName, selectedOptions)
    };
  }
);

const getPopProvinceBarChartData = createSelector(
  [ getIndicators, getSelectedOptions ],
  (indicators, selectedOptions) => {
    if (!indicators || !selectedOptions) return null;

    const INDICATOR_CODE = 'pop_total';
    const queryName = 'popProvince';

    const selectedIndicator = indicators &&
      indicators.values &&
      indicators.values.find(
        ind =>
          ind.location === selectedOptions[queryName].value &&
            ind.indicator_code === INDICATOR_CODE
      );

    const indicator = indicators &&
      indicators.indicators &&
      indicators.indicators.find(ind => ind.code === INDICATOR_CODE);
    const unit = indicator && indicator.unit;

    const selectedData = [];
    if (selectedIndicator) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: d.year, y: d.value });
        }
      });
    }

    return {
      data: selectedData,
      domain: { x: [ 'auto', 'auto' ], y: [ 0, 'auto' ] },
      config: {
        axes: {
          xBottom: { name: 'Years', unit: '', format: 'string' },
          yLeft: { name: 'Number of people', unit: '', format: 'number' }
        },
        tooltip: {
          y: {
            label: 'People',
            format: value => `${format(',.2r')(`${value * 1000}`)}`
          },
          indicator: 'Population'
        },
        animation: false,
        columns: {
          x: [ { label: 'year', value: 'x' } ],
          y: [ { label: 'Province population', value: 'y' } ]
        },
        theme: { y: { stroke: '#FC7E4B', fill: '#FC7E4B' } },
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: [ { label: 'Province population' } ],
      dataSelected: [ { label: 'Province population' } ]
    };
  }
);

const getTranslatedContent = createSelector([ getSectionsContent ], data => {
  if (!data) return null;

  const sectionSlug = 'population';
  const nationalIndicatorsSlug = 'national-indicator-label';
  const provinceIndicatorsSlug = 'province-indicator-label';

  return {
    title: getTranslation(data, sectionSlug, 'title'),
    description: getTranslation(data, sectionSlug, 'description'),
    nationalIndLabel: getTranslation(data, nationalIndicatorsSlug, 'title'),
    provinceIndLabel: getTranslation(data, provinceIndicatorsSlug, 'title')
  };
});

export const getPopulation = createStructuredSelector({
  translations: getTranslatedContent,
  nationalPopulationData: getNationalIndicatorsForPopulation,
  chartData: getBarChartData,
  query: getQuery,
  popProvinceChartData: getPopProvinceBarChartData,
  nationalIndicatorsOptions: getNationalIndicatorsForPopulationOptions,
  popProvincesOptions: getProvinceIndicatorsForPopulationOptions,
  selectedOptions: getSelectedOptions
});
