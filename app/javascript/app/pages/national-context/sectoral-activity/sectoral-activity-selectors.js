import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslatedContent } from 'selectors/translation-selectors';
import indonesiaPaths from 'utils/maps/indonesia-paths';
import uniqBy from 'lodash/uniqBy';
import snakeCase from 'lodash/snakeCase';
import sortBy from 'lodash/sortBy';
import isArray from 'lodash/isArray';
import groupBy from 'lodash/groupBy';
import toLower from 'lodash/toLower';
import startCase from 'lodash/startCase';
import capitalize from 'lodash/capitalize';

const getEmissionActivities = ({ emissionActivities }) =>
  emissionActivities && emissionActivities.data;
const getAdaptation = ({ adaptation }) => adaptation && adaptation.data;
export const getQuery = ({ location }) => location && location.query || null;

const requestedTranslations = [
  { slug: 'sectoral-activity-emissions', key: 'title', label: 'title' },
  { slug: 'sectoral-activity-year-label', key: 'title', label: 'yearLabel' },
  {
    slug: 'sectoral-activity-indicator-label',
    key: 'title',
    label: 'indicatorLabel'
  }
];

const NO_DATA = 'no-data';
const NO_DATA_LEGEND = 'No data';
const ADAPTATION_CODE = 'Adap_13';

const shouldBeGroupedByActivities = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.label !==
      PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.label;

const PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION = {
  label: 'Primary source of emissions',
  value: 'primary_source_of_emissions'
};

const getAdaptationIndicator = createSelector([ getAdaptation ], adaptation => {
  if (!adaptation) return null;

  return adaptation.indicators &&
    adaptation.indicators.find(i => i.code === ADAPTATION_CODE);
});

const getIndicators = createSelector(
  [ getEmissionActivities ],
  emissionActivities => {
    if (!emissionActivities) return null;

    return uniqBy(emissionActivities, 'sector');
  }
);

const getAdaptationParams = () => ({ code: ADAPTATION_CODE });

const getYears = createSelector(
  [ getEmissionActivities ],
  emissionActivities => {
    if (!emissionActivities) return null;
    return emissionActivities &&
      emissionActivities[0] &&
      emissionActivities[0].emissions.map(e => e.year);
  }
);

const getIdicatorsOptions = createSelector(
  [ getIndicators, getAdaptationIndicator ],
  (indicators, adaptationIndicator) => {
    if (!indicators || !adaptationIndicator) return null;

    const apiIndicators = indicators.map(ind => ({
      label: ind.sector,
      value: snakeCase(ind.sector)
    }));
    const adaptationIndicatorOption = {
      label: adaptationIndicator.name,
      value: adaptationIndicator.code
    };
    apiIndicators.push(PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION);
    apiIndicators.push(adaptationIndicatorOption);
    return sortBy(apiIndicators, 'label');
  }
);

const getYearsOptions = createSelector([ getYears ], years => {
  if (!years) return null;

  return years.map(y => ({ label: y.toString(), value: y.toString() }));
});

const getFilterOptions = createStructuredSelector({
  indicator: getIdicatorsOptions,
  year: getYearsOptions
});

const getDefaults = createSelector(getFilterOptions, options => ({
  indicator: options &&
    options.indicator &&
    options.indicator.find(
      o => o.value === PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.value
    ),
  year: options && options.year && options.year && options.year[0]
}));

const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  const options = getFilterOptions(state)[field];

  return options && options.find(o => o.value === queryValue);
};

const getSelectedOptions = createStructuredSelector({
  indicator: getFieldSelected('indicator'),
  year: getFieldSelected('year')
});

const isPrimarySourceOfEmissionSelected = selectedIndicator =>
  selectedIndicator &&
    selectedIndicator.label ===
      PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.label;

const isAdaptationSelected = selectedIndicator =>
  selectedIndicator && selectedIndicator.value === ADAPTATION_CODE;

const getProvincesData = createSelector(
  [ getEmissionActivities, getSelectedOptions, getAdaptation ],
  (emissionActivities, selectedOptions, adaptation) => {
    if (!emissionActivities || !selectedOptions || !adaptation) return null;

    const selectedIndicator = selectedOptions.indicator;

    let filteredData = [];

    if (isPrimarySourceOfEmissionSelected(selectedIndicator)) {
      filteredData = emissionActivities;
    } else if (isAdaptationSelected(selectedIndicator)) {
      filteredData = adaptation.values &&
        adaptation.values.filter(o => o.indicator_code === ADAPTATION_CODE);
    } else {
      filteredData = isArray(emissionActivities) &&
        selectedIndicator &&
        emissionActivities.filter(
          emissionData => emissionData.sector === selectedIndicator.label
        );
    }

    return { data: filteredData };
  }
);

const SECTION_COLORS = {
  Waste: '#06214C',
  Agriculture: '#FC7E4B',
  Energy: '#2EC9DF',
  Forestry: '#FCA683',
  'Industrial Process and Product Use': '#FFC735',
  'no-data': '#ffffff'
};

const COLORS = [ '#06214C', '#FC7E4B', '#2EC9DF', '#FCA683', '#FFC735' ];

const getColorsForActivities = activities => {
  const mapColors = {};
  activities.forEach((a, i) => {
    mapColors[a] = COLORS[i];
  });
  return mapColors;
};

const countryStyles = color => ({
  default: {
    fill: color,
    fillOpacity: 1,
    stroke: '#ffffff',
    strokeWidth: 0.2,
    outline: 'none'
  },
  hover: { fill: color, stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' },
  pressed: { fill: color, stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' }
});

const getPathsWithStylesForAdaptation = (
  adaptationData,
  selectedOptions,
  sectors
) =>
  {
    if (!adaptationData || !selectedOptions || !sectors) return null;

    const provincesData = adaptationData.values &&
      adaptationData.values.filter(o => o.indicator_code === ADAPTATION_CODE);
    const groupedByProvince = provincesData &&
      groupBy(provincesData, 'location_iso_code3');

    const map = {};
    if (groupedByProvince) {
      Object.keys(groupedByProvince).forEach(province => {
        map[province] = groupedByProvince[province][0] &&
          groupedByProvince[province][0].values &&
          groupedByProvince[province][0].values[0] &&
          groupedByProvince[province][0].values[0].value;
      });
    }

    const YES_NO_COLORS = { no: '#001880', yes: '#2EC9DF' };

    const paths = [];
    const legend = [];

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;
      const province = map[iso];
      if (province) {
        const value = map[iso];
        const color = YES_NO_COLORS[toLower(value)];

        // Fill the legend
        if (!legend.find(i => i.name === value)) {
          legend.push({ name: value, color });
        }
        if (!legend.find(i => toLower(i.name) === toLower(NO_DATA_LEGEND))) {
          legend.push({ name: NO_DATA_LEGEND, color: SECTION_COLORS[NO_DATA] });
        }

        const enhancedPath = {
          ...path,
          properties: { ...path.properties, tooltipValue: value }
        };
        paths.push({ ...enhancedPath, style: countryStyles(color) });
      } else {
        paths.push({ ...path, style: countryStyles(SECTION_COLORS[NO_DATA]) });
      }
    });

    return { paths, legend };
  };

export const getPathsWithStyles = (provincesData, selectedOptions, sectors) => {
  if (!provincesData || !selectedOptions || !sectors) return null;

  const selectedYear = selectedOptions.year;
  const selectedIndicator = selectedOptions.indicator;

  const paths = [];

  const groupedByProvince = provincesData &&
    groupBy(provincesData.data, 'location_iso_code3');

  const provinceKeys = Object.keys(groupedByProvince);
  const groupedByProvinceThenSector = {};
  if (provinceKeys) {
    provinceKeys.forEach(key => {
      groupedByProvinceThenSector[key] = groupBy(
        groupedByProvince[key],
        'sector'
      );
    });
  }

  const notAllowed = [ 'IDN' ];
  const onlyProvinces = Object
    .keys(groupedByProvinceThenSector)
    .filter(province => !notAllowed.includes(province));

  // GROUPED BY PROVINCES AND SECTORS, ONLY FOR PROVINCES (filter out IND as a whole)
  const provinces = {};
  onlyProvinces.forEach(provinceIso => {
    provinces[provinceIso] = groupedByProvinceThenSector[provinceIso];
  });

  const emissions = {};
  if (shouldBeGroupedByActivities(selectedIndicator)) {
    const groupByActivities = {};
    Object.keys(provinces).forEach(province => {
      const chosenSectorName = selectedIndicator && selectedIndicator.label;
      groupByActivities[province] = groupBy(
        provinces[province][chosenSectorName],
        'activity'
      );
    });

    Object.keys(groupByActivities).forEach(province => {
      emissions[province] = {};
      Object.keys(groupByActivities[province]).forEach(activity => {
        emissions[province][activity] = [];
        if (groupByActivities[province][activity]) {
          groupByActivities[province][activity].forEach(o => {
            emissions[province][activity].push(
              o.emissions.find(e => e.year === parseInt(selectedYear.value, 10))
            );
          });
        }
      });
    });

    Object.keys(emissions).forEach(province => {
      const activities = Object.keys(emissions[province]);
      activities.forEach(a => {
        emissions[province][a] = emissions[province][a]
          .map(o => o.value)
          .reduce((val, acc) => val + acc);
      });
    });
  } else {
    // WHICH SECTOR HAS THE GREATEST EMISSION IN THE PROVINCE
    // for each province
    const provincesIsos = Object.keys(provinces);

    // EMISSIONS FOR SECTOR FOR GIVEN YEAR
    provincesIsos.forEach(province => {
      // for each sector
      const sectorNames = Object.keys(provinces[province]);
      emissions[province] = {};
      sectorNames.forEach(s => {
        emissions[province][s] = [];
        if (provinces[province][s]) {
          provinces[province][s].forEach(o => {
            emissions[province][s].push(
              o.emissions.find(e => e.year === parseInt(selectedYear.value, 10))
            );
          });
        }
      });
    });

    // TOTAL EMISSIONS FOR SECTOR FOR GIVEN YEAR
    provincesIsos.forEach(province => {
      const sectorNames = Object.keys(provinces[province]);
      sectorNames.forEach(s => {
        emissions[province][s] = emissions[province][s]
          .map(o => o.value)
          .reduce((val, acc) => val + acc);
      });
    });
  }

  const legend = [];

  indonesiaPaths.forEach(path => {
    const iso = path.properties && path.properties.code_hasc;
    const province = emissions[iso];
    if (province) {
      const highestEmissionsSector = Object.keys(province).length &&
        Object
          .keys(province)
          .reduce((a, b) => province[a] > province[b] ? a : b);
      const highestEmissionsValue = province[highestEmissionsSector];
      const enhancedPaths = {
        ...path,
        properties: {
          ...path.properties,
          selectedYear: selectedYear && selectedYear.value,
          sector: highestEmissionsSector,
          tooltipValue: highestEmissionsValue
        }
      };
      const sectorWithData = highestEmissionsValue
        ? highestEmissionsSector
        : NO_DATA;
      const activities = Object.keys(province);
      const shouldUseCountryStyles = sectorWithData === NO_DATA ||
        !shouldBeGroupedByActivities(selectedIndicator);
      const color = shouldUseCountryStyles
        ? SECTION_COLORS[sectorWithData]
        : getColorsForActivities(activities)[sectorWithData];

      // Fill legend
      const humanizedSectorName = capitalize(
        toLower(startCase(sectorWithData))
      );
      if (!legend.find(i => i.name === humanizedSectorName)) {
        legend.push({ name: humanizedSectorName, color });
      }
      if (!legend.find(i => toLower(i.name) === toLower(NO_DATA_LEGEND))) {
        legend.push({ name: NO_DATA_LEGEND, color: SECTION_COLORS[NO_DATA] });
      }

      paths.push({ ...enhancedPaths, style: countryStyles(color) });
    } else {
      paths.push({ ...path, style: countryStyles(SECTION_COLORS[NO_DATA]) });
    }
  });

  return { paths, legend };
};

const getPaths = createSelector(
  [ getAdaptation, getProvincesData, getSelectedOptions, getIndicators ],
  (adaptation, provincesData, selectedOptions, indicators) => {
    if (!adaptation || !provincesData || !selectedOptions || !indicators)
      return null;

    return isAdaptationSelected(selectedOptions.indicator)
      ? getPathsWithStylesForAdaptation(adaptation, selectedOptions, indicators)
      : getPathsWithStyles(provincesData, selectedOptions, indicators);
  }
);

export const getSectoralActivity = createStructuredSelector({
  translations: getTranslatedContent(requestedTranslations),
  indicators: getIndicators,
  options: getFilterOptions,
  selectedOptions: getSelectedOptions,
  years: getYears,
  query: getQuery,
  map: getPaths,
  adaptationParams: getAdaptationParams,
  adaptationCode: () => ADAPTATION_CODE
});
