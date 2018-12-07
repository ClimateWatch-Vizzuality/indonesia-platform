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

import {
  REQUESTED_TRANSLATIONS,
  NO_DATA,
  NO_DATA_LEGEND,
  ADAPTATION_CODE,
  EMISSIONS_UNIT,
  PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION,
  SECTION_COLORS,
  COLORS,
  YES_NO_COLORS,
  ISOS_NOT_ALLOWED,
  LOCATION_ISO_CODE,
  getMapStyles
} from './sectoral-activity-constants';

import {
  shouldBeGroupedByActivities,
  isPrimarySourceOfEmissionSelected,
  isAdaptationSelected
} from './sectoral-activity-abilities';

import {
  getEmissionActivities,
  getAdaptation,
  getQuery
} from './sectoral-activity-redux-selectors';

const getAdaptationParams = () => ({ code: ADAPTATION_CODE });

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

const getYears = createSelector(
  [ getEmissionActivities ],
  emissionActivities => {
    if (!emissionActivities) return null;
    return emissionActivities &&
      emissionActivities[0] &&
      emissionActivities[0].emissions.map(e => e.year);
  }
);

const getIndicatorsOptions = createSelector(
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
  indicator: getIndicatorsOptions,
  year: getYearsOptions
});

const getDefaults = createSelector(getFilterOptions, options => ({
  indicator: options &&
    options.indicator &&
    options.indicator.find(
      o => o.value === PRIMARY_SOURCE_OF_EMISSION_INDICATOR_OPTION.value
    ),
  year: options && options.year && options.year[0]
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

const getColorsForActivities = activities => {
  const mapColors = {};
  activities.forEach((a, i) => {
    mapColors[a] = COLORS[i];
  });
  return mapColors;
};

const getParsedDataForAdaptation = createSelector(
  [ getAdaptation, getSelectedOptions ],
  (adaptationData, selectedOptions) => {
    if (!adaptationData || !selectedOptions) return null;

    const provincesData = adaptationData.values &&
      adaptationData.values.filter(o => o.indicator_code === ADAPTATION_CODE);

    const groupedByProvince = provincesData &&
      groupBy(provincesData, LOCATION_ISO_CODE);

    const map = {};
    if (groupedByProvince) {
      Object.keys(groupedByProvince).forEach(province => {
        map[province] = groupedByProvince[province][0] &&
          groupedByProvince[province][0].values &&
          groupedByProvince[province][0].values[0] &&
          groupedByProvince[province][0].values[0].value;
      });
    }

    return map;
  }
);

const getPathsWithStylesForAdaptationSelector = createSelector(
  [ getParsedDataForAdaptation ],
  parsedDataForAdaptation => {
    if (!parsedDataForAdaptation) return null;

    const paths = [];
    const legend = [];

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;
      const province = parsedDataForAdaptation[iso];
      if (province) {
        const value = parsedDataForAdaptation[iso];
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
        paths.push({ ...enhancedPath, style: getMapStyles(color) });
      } else {
        paths.push({ ...path, style: getMapStyles(SECTION_COLORS[NO_DATA]) });
      }
    });

    return { paths, legend };
  }
);

const getSelectedYear = createSelector(
  [ getSelectedOptions ],
  selectedOptions => selectedOptions ? selectedOptions.year : null
);

const getSelectedIndicator = createSelector(
  [ getSelectedOptions ],
  selectedOptions => selectedOptions ? selectedOptions.indicator : null
);

const getGroupedData = createSelector(
  [ getProvincesData, getSelectedOptions, getIndicators ],
  (provincesData, selectedOptions, sectors) => {
    if (!provincesData || !selectedOptions || !sectors) return null;

    const groupedByProvince = provincesData &&
      groupBy(provincesData.data, LOCATION_ISO_CODE);

    const provinceKeys = Object
      .keys(groupedByProvince)
      .filter(province => !ISOS_NOT_ALLOWED.includes(province));
    const provinces = {};
    if (provinceKeys) {
      provinceKeys.forEach(key => {
        provinces[key] = groupBy(groupedByProvince[key], 'sector');
      });
    }

    return provinces;
  }
);

const getParsedDataForActivities = createSelector(
  [ getGroupedData, getSelectedIndicator, getSelectedYear ],
  (provinces, selectedIndicator, selectedYear) => {
    if (!provinces || !selectedIndicator || !selectedYear) return null;

    const groupByActivities = {};
    const emissions = {};

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

    return emissions;
  }
);

const getParsedDataForSectors = createSelector(
  [ getGroupedData, getSelectedYear, getSelectedIndicator ],
  (provinces, selectedYear, selectedIndicator) => {
    if (!provinces || !selectedYear) return null;

    const provincesIsos = Object.keys(provinces);
    const emissions = {};

    if (!isAdaptationSelected(selectedIndicator)) {
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
                o.emissions.find(
                  e => e.year === parseInt(selectedYear.value, 10)
                )
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

    return emissions;
  }
);

const getPathsWithStylesSelector = createSelector(
  [
    getParsedDataForSectors,
    getParsedDataForActivities,
    getSelectedIndicator,
    getSelectedYear
  ],
  (
    parsedDataForSectors,
    parsedDataForActivities,
    selectedIndicator,
    selectedYear
  ) =>
    {
      if (
        !parsedDataForSectors ||
          !parsedDataForActivities ||
          !selectedIndicator ||
          !selectedYear
      )
        return null;

      const emissions = shouldBeGroupedByActivities(selectedIndicator)
        ? parsedDataForActivities
        : parsedDataForSectors;

      const paths = [];
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
              tooltipValue: highestEmissionsValue,
              tooltipUnit: EMISSIONS_UNIT
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
            legend.push({
              name: NO_DATA_LEGEND,
              color: SECTION_COLORS[NO_DATA]
            });
          }

          paths.push({ ...enhancedPaths, style: getMapStyles(color) });
        } else {
          paths.push({ ...path, style: getMapStyles(SECTION_COLORS[NO_DATA]) });
        }
      });

      return { paths, legend };
    }
);

const getPaths = createSelector(
  [
    getSelectedIndicator,
    getPathsWithStylesForAdaptationSelector,
    getPathsWithStylesSelector
  ],
  (selectedIndicator, pathsForAdaptation, pathsForEmissions) => {
    if (!selectedIndicator || !pathsForAdaptation || !pathsForEmissions)
      return { paths: [], legend: [] };

    return isAdaptationSelected(selectedIndicator)
      ? pathsForAdaptation
      : pathsForEmissions;
  }
);

export const getSectoralActivity = createStructuredSelector({
  translations: getTranslatedContent(REQUESTED_TRANSLATIONS),
  indicators: getIndicators,
  options: getFilterOptions,
  selectedOptions: getSelectedOptions,
  years: getYears,
  query: getQuery,
  map: getPaths,
  adaptationParams: getAdaptationParams,
  adaptationCode: () => ADAPTATION_CODE
});
