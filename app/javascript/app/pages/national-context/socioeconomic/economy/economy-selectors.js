import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslate } from 'selectors/translation-selectors';
import { format } from 'd3-format';
import sortBy from 'lodash/sortBy';
import capitalize from 'lodash/capitalize';
import uniq from 'lodash/uniq';
import {
  getQuery,
  getIndicatorsData,
  getNationalIndicators,
  getFirstChartFilter,
  getXColumn,
  getDomain,
  getAxes
} from '../population/population-selectors';

const { COUNTRY_ISO } = process.env;

const DATA_SCALE = '1000000';

const getNationalIndicatorsForEconomy = createSelector(
  [ getNationalIndicators ],
  indicators => {
    if (!indicators) return null;

    return indicators.filter(ind => ind.indicator_code.includes('GDP_'));
  }
);

const getNationalIndicatorsIndicatorsForEconomy = createSelector(
  [ getIndicatorsData ],
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
  [ getIndicatorsData ],
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
    'billion Rupiahs': value => `${value / DATA_SCALE}B`,
    'million Rupiahs': value => `${value}M`,
    '%': value => `${value}%`
  };
  return formatY[unit];
};

export const getTheme = color => ({ y: { stroke: color, fill: color } });

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

    const formatsForTooltip = {
      'billion Rupiahs': value => `${format(',.2f')(value / DATA_SCALE)}B`,
      'million Rupiahs': value => `${value}M`,
      '%': value => `${value}%`
    };

    const yLabelTooltip = unit === '%' ? 'percentage' : unit;

    return {
      data: selectedData,
      domain: getDomain(),
      config: {
        axes: getAxes('Years', 'GDP'),
        tooltip: {
          y: {
            label: capitalize(yLabelTooltip),
            format: formatsForTooltip[unit]
          },
          x: { label: 'Year' },
          indicator: selectedOptions[queryName] &&
            selectedOptions[queryName].label
        },
        animation: false,
        columns: {
          x: getXColumn(),
          y: [
            {
              label: selectedOptions[queryName] &&
                selectedOptions[queryName].label,
              value: 'y'
            }
          ]
        },
        theme: getTheme('#01B4D2'),
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
    getIndicatorsData,
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
      domain: getDomain(),
      config: {
        axes: getAxes('Years', 'GDP'),
        tooltip: {
          y: { label: 'Rupiahs', format: value => `${format('.3s')(value)}` },
          x: { label: 'Year' },
          indicator: 'GDP at current price'
        },
        animation: false,
        columns: { x: getXColumn(), y: [ { label: 'GDP Price', value: 'y' } ] },
        theme: getTheme('#FC7E4B'),
        yLabelFormat: value => `${format('.2s')(value)}`
      },
      dataOptions: [ { label: 'GDP Price' } ],
      dataSelected: [ { label: 'GDP Price' } ]
    };
  }
);

const getSources = createSelector(
  [ getNationalIndicatorsForEconomy ],
  iValues => uniq((iValues || []).map(i => i.source))
);

const getIndicatorCodes = createSelector(
  [ getNationalIndicatorsForEconomy ],
  iValues => uniq((iValues || []).map(i => i.indicator_code))
);
const getDownloadURI = createSelector(
  [ getSources, getIndicatorCodes ],
  (sources, indicatorCodes) =>
    `indicators.zip?code=${indicatorCodes.join(',')}&source=${sources.join(
      ','
    )}`
);

export const getEconomy = createStructuredSelector({
  t: getTranslate,
  query: getQuery,
  nationalChartData: getNationalBarChartData,
  provincialChartData: getProvincialBarChartData,
  nationalOptions: getNationalIndicatorsForEconomyOptions,
  provincesOptions: getProvinceIndicatorsForEconomyOptions,
  selectedOptions: getSelectedOptions,
  sources: getSources,
  downloadURI: getDownloadURI
});
