export const ALL_SELECTED = 'All Selected';
export const TOP_10_EMMITERS = 'Top 10 emmiters';

export const ALL_SELECTED_OPTION = { label: ALL_SELECTED, value: ALL_SELECTED };
// TODO: Remember to change this defaults once we get the province data
export const TOP_10_EMMITERS_OPTION = {
  label: TOP_10_EMMITERS,
  value: [
    'Aceh',
    'Bali',
    'Bangka Belitung Islands',
    'Banten',
    'Bengkulu',
    'Gorontalo',
    'Jambi',
    'Maluku',
    'North Kalimantan',
    'West Java'
  ]
};
export const API_TARGET_DATA_SCALE = 1000;
export const METRIC_OPTIONS = {
  ABSOLUTE_VALUE: { label: 'Absolute value', value: 'ABSOLUTE_VALUE' },
  PER_CAPITA: { label: 'per Capita', value: 'PER_CAPITA' },
  PER_GDP: { label: 'per GDP', value: 'PER_GDP' }
};
export const METRIC_API_FILTER_NAMES = {
  ABSOLUTE_VALUE: 'Absolute value',
  PER_CAPITA: 'Emission per Capita',
  PER_GDP: 'Emission per GDP'
};
