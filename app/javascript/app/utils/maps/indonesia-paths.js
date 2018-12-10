import { feature } from 'topojson-client';

import topojson from './indonesia.json';

const paths = feature(
  topojson,
  topojson.objects[Object.keys(topojson.objects)[1]]
).features;

export default paths;
