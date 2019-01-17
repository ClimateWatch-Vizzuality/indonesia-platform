import { createSelector } from 'reselect';
import flatten from 'lodash/flatten';
import scaleCluster from 'd3-scale-cluster';

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

const composeBuckets = bucketValues => {
  const buckets = [];

  bucketValues.concat([ null ]).reduce(
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

const createScale = allValues =>
  scaleCluster()
    .domain(allValues.map(v => Math.round(v)))
    .range(MAP_BUCKET_COLORS);

const createBucketColorScale = emissions => {
  const totalEmissionsByProvinceYear = emissions.reduce(
    (acc, e) => {
      const key = `${e.provinceISO}_${e.year}`;
      return { ...acc, [key]: (acc[key] || 0) + e.value };
    },
    {}
  );

  const allEmissionValues = Object
    .keys(totalEmissionsByProvinceYear)
    .map(key => totalEmissionsByProvinceYear[key]);

  return createScale(allEmissionValues);
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
    const filteredEmissions = filterBySelectedOptions(
      emissions,
      selectedOptions
    );
    if (!filteredEmissions.length) return { paths: indonesiaPaths };
    const normalizedEmissions = flatten(
      filteredEmissions.map(
        e =>
          e.emissions.map(ev => ({
            provinceISO: e.iso_code3,
            year: ev.year,
            value: ev.value / divisor
          }))
      )
    );
    const year = selectedYear || years[years.length - 1];
    const filteredByYear = normalizedEmissions.filter(e => e.year === year);

    const bucketColorScale = createBucketColorScale(normalizedEmissions);
    const buckets = composeBuckets(bucketColorScale.clusters());

    indonesiaPaths.forEach(path => {
      const iso = path.properties && path.properties.code_hasc;

      const totalEmission = filteredByYear
        .filter(e => e.provinceISO === iso)
        .reduce((sum, e) => sum + e.value, 0);
      const bucketColor = bucketColorScale(totalEmission);

      paths.push({ ...path, style: getMapStyles(bucketColor) });
    });

    return { paths, buckets, unit: correctedUnit, mapCenter };
  }
);
