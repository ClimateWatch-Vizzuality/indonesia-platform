import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';

import { getProvince } from 'selectors/provinces-selectors';

import indonesiaPaths from 'utils/maps/indonesia-paths';

import {
  filterBySelectedOptions,
  getEmissionsData,
  getUnit,
  getSelectedOptions
} from '../regions-ghg-emissions-selectors';

const DEFAULT_MAP_CENTER = [ 113, -1.86 ];
const MAP_BUCKET_COLORS = [
  '#FFFFFF',
  '#B3DDF8',
  '#3AA2E0',
  '#297CB8',
  '#064584'
];
const MAP_BUCKETS = [ 10, 100, 500, 1000 ];

const getSelectedYear = (state, { selectedYear }) => selectedYear;

const getMapStyles = color => ({
  default: {
    fill: color,
    fillOpacity: 1,
    stroke: '#ffffff',
    strokeWidth: 0.2,
    outline: 'none'
  },
  hover: { fill: color, stroke: '#ffffff', strokeWidth: 0.6, outline: 'none' },
  pressed: { fill: color, stroke: '#ffffff', strokeWidth: 0.2, outline: 'none' }
});

const getBucketByValue = value => {
  for (let i = 0; i < MAP_BUCKETS.length; i++) {
    if (value < MAP_BUCKETS[i]) return MAP_BUCKET_COLORS[i];
  }
  return MAP_BUCKET_COLORS[MAP_BUCKET_COLORS.length - 1];
};

const composeBuckets = () => {
  const buckets = [];

  MAP_BUCKETS.concat([ null ]).reduce(
    (prev, curr, index) => {
      buckets.push({
        minValue: prev,
        maxValue: curr,
        color: MAP_BUCKET_COLORS[index]
      });
      return curr;
    },
    null
  );

  return buckets;
};

export const getMap = createSelector(
  [
    getEmissionsData,
    getUnit,
    getSelectedOptions,
    getProvince,
    getSelectedYear
  ],
  (emissions, unit, selectedOptions, provinceISO, selectedYear) => {
    if (!emissions || !selectedOptions || !unit) return {};

    const years = emissions.length && emissions[0].emissions.map(d => d.year);
    const paths = [];
    const divisor = unit.startsWith('kt') ? 1000 : 1;
    const correctedUnit = unit.replace('kt', 'Mt');
    const byProvinceISO = path =>
      (path.properties && path.properties.code_hasc) === provinceISO;
    const provincePath = indonesiaPaths.find(byProvinceISO);
    const mapCenter = provincePath
      ? [ provincePath.properties.longitude, provincePath.properties.latitude ]
      : DEFAULT_MAP_CENTER;

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;

      const provinceEmissions = emissions.filter(e => e.iso_code3 === iso);
      const filteredEmissions = filterBySelectedOptions(
        provinceEmissions,
        selectedOptions
      );
      const year = selectedYear || years[years.length - 1];
      const emissionsByYear = flatten(
        filteredEmissions.map(
          e => e.emissions
            .filter(v => v.year === year)
            .map(v => v.value)
        )
      );
      const totalEmission = emissionsByYear.reduce((sum, v) => sum + v, 0) /
        divisor;
      const bucketColor = getBucketByValue(totalEmission);

      paths.push({ ...path, style: getMapStyles(bucketColor) });
    });

    return { paths, buckets: composeBuckets(), unit: correctedUnit, mapCenter };
  }
);
