import { createStructuredSelector, createSelector } from 'reselect';
import indonesiaPaths from 'utils/maps/indonesia-paths';
import uniqBy from 'lodash/uniqBy';
import sortBy from 'lodash/sortBy';
import get from 'lodash/get';
import isArray from 'lodash/isArray';
import groupBy from 'lodash/groupBy';
import toLower from 'lodash/toLower';
import startCase from 'lodash/startCase';
import capitalize from 'lodash/capitalize';

import { getTranslate } from 'selectors/translation-selectors';
import {
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

const getSectors = createSelector(
  [ getEmissionActivities ],
  emissionActivities => {
    if (!emissionActivities) return null;

    return uniqBy(
      emissionActivities,
      'sector_code'
    ).map(em => ({ name: em.sector, code: em.sector_code }));
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
  [ getSectors, getAdaptationIndicator ],
  (sectors, adaptationIndicator) => {
    if (!sectors || !adaptationIndicator) return null;

    const apiIndicators = sectors.map(s => ({ label: s.name, value: s.code }));
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
          emissionData => emissionData.sector_code === selectedIndicator.value
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
        map[province] = get(groupedByProvince[province], '[0].values[0].value');
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
  [ getProvincesData, getSelectedOptions, getSectors ],
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
        provinces[key] = groupBy(groupedByProvince[key], 'sector_code');
      });
    }

    return provinces;
  }
);

const getParsedDataForActivities = (
  groupedData,
  selectedYear,
  selectedIndicator
) =>
  {
    const chosenSector = selectedIndicator.value;
    const bySelectedYear = e => e.year === parseInt(selectedYear.value, 10);
    const provinces = Object.keys(groupedData);

    const emissions = {};

    // total emissions for province and activity
    provinces.forEach(province => {
      const emissionsByActivities = groupBy(
        groupedData[province][chosenSector],
        'activity'
      );
      const activities = Object.keys(emissionsByActivities);
      const totalEmissionForActivity = activity =>
        emissionsByActivities[activity]
          .reduce((acc, o) => acc.concat(o.emissions), [])
          .filter(bySelectedYear)
          .reduce((sum, emission) => sum + emission.value, 0);

      emissions[province] = activities.reduce(
        (acc, activity) => ({
          ...acc,
          [activity]: totalEmissionForActivity(activity)
        }),
        {}
      );
    });

    return emissions;
  };

const getParsedDataForSectors = (groupedData, selectedYear) => {
  const bySelectedYear = e => e.year === parseInt(selectedYear.value, 10);
  const provinces = Object.keys(groupedData);
  const emissions = {};

  // total emissions for province and sector
  provinces.forEach(province => {
    const sectors = Object.keys(groupedData[province]);
    const totalEmissionForSector = sector => groupedData[province][sector]
      .reduce((acc, o) => acc.concat(o.emissions), [])
      .filter(bySelectedYear)
      .reduce((sum, emission) => sum + emission.value, 0);

    emissions[province] = sectors.reduce(
      (acc, sector) => ({ ...acc, [sector]: totalEmissionForSector(sector) }),
      {}
    );
  });

  return emissions;
};

const getEmissions = createSelector(
  [ getGroupedData, getSelectedYear, getSelectedIndicator ],
  (groupedData, selectedYear, selectedIndicator) => {
    if (!groupedData || !selectedYear || !selectedIndicator) return null;
    if (isAdaptationSelected(selectedIndicator)) return {};

    if (shouldBeGroupedByActivities(selectedIndicator)) {
      return getParsedDataForActivities(
        groupedData,
        selectedYear,
        selectedIndicator
      );
    }

    return getParsedDataForSectors(groupedData, selectedYear);
  }
);

const getPathsWithStylesSelector = createSelector(
  [ getEmissions, getSelectedIndicator, getSelectedYear, getSectors ],
  (emissions, selectedIndicator, selectedYear, sectors) => {
    if (!emissions || !selectedIndicator || !selectedYear) return null;

    const getSectorName = sectorCode => {
      const sec = sectors.find(s => s.code === sectorCode);
      return sec && sec.name || sectorCode;
    };

    const paths = [];
    const legend = [];

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;
      const emissionsPerSector = emissions[iso];
      if (emissionsPerSector) {
        const provinceSectors = Object.keys(emissionsPerSector);
        const highestEmissionsSector = provinceSectors.length &&
          provinceSectors.reduce(
            (a, b) => emissionsPerSector[a] > emissionsPerSector[b] ? a : b
          );
        const highestEmissionsValue = emissionsPerSector[highestEmissionsSector];
        const enhancedPaths = {
          ...path,
          properties: {
            ...path.properties,
            selectedYear: selectedYear && selectedYear.value,
            sector: getSectorName(highestEmissionsSector),
            tooltipValue: highestEmissionsValue,
            tooltipUnit: EMISSIONS_UNIT
          }
        };
        const sectorWithData = highestEmissionsValue
          ? highestEmissionsSector
          : NO_DATA;
        const shouldUseCountryStyles = sectorWithData === NO_DATA ||
          !shouldBeGroupedByActivities(selectedIndicator);
        const color = shouldUseCountryStyles
          ? SECTION_COLORS[sectorWithData]
          : getColorsForActivities(provinceSectors)[sectorWithData];

        // Fill legend
        const humanizedSectorName = capitalize(
          toLower(startCase(getSectorName(sectorWithData)))
        );
        if (!legend.find(i => i.name === humanizedSectorName)) {
          legend.push({ name: humanizedSectorName, color });
        }

        paths.push({ ...enhancedPaths, style: getMapStyles(color) });
      } else {
        paths.push({ ...path, style: getMapStyles(SECTION_COLORS[NO_DATA]) });
      }
    });

    legend.push({ name: NO_DATA_LEGEND, color: SECTION_COLORS[NO_DATA] });

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
  t: getTranslate,
  options: getFilterOptions,
  selectedOptions: getSelectedOptions,
  years: getYears,
  query: getQuery,
  map: getPaths,
  adaptationParams: getAdaptationParams,
  adaptationCode: () => ADAPTATION_CODE
});
