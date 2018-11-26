import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslation } from 'utils/translations';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import {
  getQuery,
  getSectionsContent,
  getIndicators,
  getNationalIndicators,
  getFirstChartFilter
} from '../population/population-selectors';

const { COUNTRY_ISO } = process.env;

const getTranslatedContent = createSelector([ getSectionsContent ], data => {
  if (!data) return null;

  const sectionSlug = 'economic';
  const nationalIndicatorsSlug = 'national-indicator-label';
  const provinceIndicatorsSlug = 'province-indicator-label';

  return {
    title: getTranslation(data, sectionSlug, 'title'),
    description: getTranslation(data, sectionSlug, 'description'),
    nationalIndLabel: getTranslation(data, nationalIndicatorsSlug, 'title'),
    provinceIndLabel: getTranslation(data, provinceIndicatorsSlug, 'title')
  };
});

const getNationalIndicatorsForEconomy = createSelector(
  [ getNationalIndicators ],
  indicators => {
    if (!indicators) return null;

    return indicators.filter(ind => ind.indicator_code.includes('GDP_'));
  }
);

const getNationalIndicatorsIndicatorsForEconomy = createSelector(
  [ getIndicators ],
  indicators => {
    if (!indicators) return null;

    const indicatorsWithLabels = indicators && indicators.indicators;

    return indicatorsWithLabels &&
      indicatorsWithLabels.filter(ind => ind.code.includes('GDP_'));
  }
);

const getNationalIndicatorsForEconomyOptions = createSelector(
  [ getNationalIndicatorsIndicatorsForEconomy ],
  indicators => {
    if (!indicators) return null;

    return sortBy(
      indicators.map(ind => ({ label: ind.name, value: ind.code })),
      'label'
    );
  }
);

const getProvinceIndicatorsForEconomyOptions = createSelector(
  [ getIndicators ],
  indicators => {
    if (!indicators) return null;

    const GDP_INDICATOR = 'GDP_price';
    const options = [];

    const economyProvinces = indicators &&
      indicators.values &&
      indicators.values.filter(
        ind =>
          ind.location_iso_code3 !== COUNTRY_ISO &&
            ind.indicator_code === GDP_INDICATOR
      );

    if (economyProvinces) {
      economyProvinces.forEach(
        province =>
          options.push({ label: province.location, value: province.location })
      );
    }

    return sortBy(options, 'label');
  }
);

const getFilterOptions = createStructuredSelector({
  gdpNationalIndicator: getNationalIndicatorsForEconomyOptions,
  gdpProvince: getProvinceIndicatorsForEconomyOptions
});

const getDefaults = createSelector(getFilterOptions, options => ({
  gdpNationalIndicator: options &&
    options.gdpNationalIndicator &&
    options.gdpNationalIndicator.find(o => o.value === 'GDP_price'),
  gdpProvince: options &&
    options.gdpProvince &&
    options.gdpProvince.find(o => o.value === 'Aceh')
}));

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  return options && options.find(o => o.value === queryValue);
};

const getSelectedOptions = createStructuredSelector({
  gdpNationalIndicator: getFieldSelected('gdpNationalIndicator'),
  gdpProvince: getFieldSelected('gdpProvince')
});

// Y LABEL FORMATS
const getCustomYLabelFormat = unit => {
  const formatY = {
    'billion Rupiahs': value => `${value}B`,
    'million Rupiahs': value => `${format('.2s')(`${value * 1000}`)}`,
    rupiahs: value => `${value * 10}R`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

const getNationalBarChartData = createSelector(
  [
    getNationalIndicatorsIndicatorsForEconomy,
    getNationalIndicatorsForEconomy,
    getSelectedOptions
  ],
  (indicatorsWithLabels, indicators, selectedOptions) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'gdpNationalIndicator';

    const selectedIndicator = indicators.find(
      ind => ind.indicator_code === selectedOptions[queryName].value
    );

    const code = selectedIndicator && selectedIndicator.indicator_code;
    const indicator = indicatorsWithLabels &&
      indicatorsWithLabels.find(ind => ind.code === code);
    const unit = indicator && indicator.unit;

    const selectedData = [];
    if (selectedIndicator && selectedIndicator.values) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: parseInt(d.year, 10), y: d.value });
        }
      });
    }

    return {
      data: selectedData,
      domain: { x: [ 'auto', 'auto' ], y: [ null, 'auto' ] },
      config: {
        axes: {
          xBottom: { name: 'Years', unit: '', format: 'string' },
          yLeft: { name: 'GDP', unit: '', format: 'number' }
        },
        tooltip: {
          y: {
            label: capitalize(unit),
            format: value => `${format('.2')(`${value}`)}`
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
        theme: { y: { stroke: '#01B4D2', fill: '#01B4D2' } },
        yLabelFormat: getCustomYLabelFormat(unit)
      },
      dataOptions: getFirstChartFilter(queryName, selectedOptions),
      dataSelected: getFirstChartFilter(queryName, selectedOptions)
    };
  }
);

const getProvincialBarChartData = createSelector(
  [
    getNationalIndicatorsIndicatorsForEconomy,
    getIndicators,
    getSelectedOptions
  ],
  (indicatorsWithLabels, indicators, selectedOptions) => {
    if (!indicators || !indicatorsWithLabels) return null;

    const queryName = 'gdpProvince';
    const INDICATOR_CODE = 'GDP_price';

    const selectedIndicator = indicators &&
      indicators.values &&
      indicators.values.find(
        ind =>
          ind.location === selectedOptions[queryName].value &&
            ind.indicator_code === INDICATOR_CODE
      );

    const selectedData = [];
    if (selectedIndicator && selectedIndicator.values) {
      selectedIndicator.values.forEach(d => {
        if (d.value && d.year) {
          selectedData.push({ x: parseInt(d.year, 10), y: d.value });
        }
      });
    }

    return {
      data: selectedData,
      domain: { x: [ 'auto', 'auto' ], y: [ null, 'auto' ] },
      config: {
        axes: {
          xBottom: { name: 'Years', unit: '', format: 'string' },
          yLeft: { name: 'GDP', unit: '', format: 'number' }
        },
        tooltip: {
          y: {
            label: 'Rupiahs',
            format: value => `${format(',.2r')(`${value * 100000}`)}`
          },
          x: { label: 'Year' },
          indicator: 'GDP at current price'
        },
        animation: false,
        columns: {
          x: [ { label: 'year', value: 'x' } ],
          y: [ { label: 'GDP Price', value: 'y' } ]
        },
        theme: { y: { stroke: '#FC7E4B', fill: '#FC7E4B' } },
        yLabelFormat: getCustomYLabelFormat('rupiahs')
      },
      dataOptions: [ { label: 'GDP Price' } ],
      dataSelected: [ { label: 'GDP Price' } ]
    };
  }
);

export const getEconomy = createStructuredSelector({
  translations: getTranslatedContent,
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  provincialChartData: getProvincialBarChartData,
  nationalOptions: getNationalIndicatorsForEconomyOptions,
  provincesOptions: getProvinceIndicatorsForEconomyOptions,
  selectedOptions: getSelectedOptions
});
