import { createStructuredSelector } from 'reselect';

const SOURCE_OPTIONS = [
  { name: 'CAIT SOURCE', value: 'cait' },
  { name: 'SIGN SMART SOURCE', value: 'sign-smart' }
];

const CHART_TYPE_OPTIONS = [
  { label: 'area', value: 'area' },
  { label: 'line', value: 'line' },
  { label: 'percentage', value: 'percentage' }
];

const getSource = ({ location }) =>
  location.query ? location.query.source : 'cait';

const getChartTypeSelected = ({ location }) =>
  location.query ? location.query.chartType : 'cait';

const getFilterOptions = createStructuredSelector({
  source: () => SOURCE_OPTIONS,
  chartType: () => CHART_TYPE_OPTIONS
});

const getSelectedOptions = createStructuredSelector({
  source: getSource,
  chartType: getChartTypeSelected
});

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions
});
