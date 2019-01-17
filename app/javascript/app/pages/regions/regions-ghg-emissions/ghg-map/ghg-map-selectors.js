import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';

import indonesiaPaths from 'utils/maps/indonesia-paths';

import {
  getEmissionsData,
  getSelectedOptions,
  filterBySelectedOptions
} from '../regions-ghg-emissions-selectors';

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

export const getMap = createSelector(
  [ getEmissionsData, getSelectedOptions, getSelectedYear ],
  (emissions, selectedOptions, selectedYear) => {
    if (!emissions || !selectedOptions) return {};

    const years = emissions.length && emissions[0].emissions.map(d => d.year);
    const paths = [];

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
      const totalEmission = emissionsByYear.reduce((sum, v) => sum + v, 0);
      const bucketColor = getBucketByValue(totalEmission);

      // if (filteredEmissions.length) {
      //   debugger;
      // }
      paths.push({ ...path, style: getMapStyles(bucketColor) });
    });

    return { paths, buckets: MAP_BUCKET_COLORS };
  }
);
