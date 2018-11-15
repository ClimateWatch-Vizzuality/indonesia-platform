import { createStructuredSelector, createSelector } from 'reselect';
import isArray from 'lodash/isArray';
import { ALL_SELECTED, ALL_SELECTED_OPTION } from 'constants/constants';

const { COUNTRY_ISO } = process.env;

const findOption = (options, value) =>
  options && options.find(o => o.value === value || o.name === value);

const getQuery = ({ location }) => location && location.query || null;
const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data || null;

// OPTIONS
const CHART_TYPE_OPTIONS = [
  { label: 'Area', value: 'area' },
  { label: 'Line', value: 'line' }
];
const BREAK_BY_OPTIONS = [
  { label: 'Province - Absolute', value: 'province-absolute' },
  { label: 'Province - Per GDP', value: 'province-gdp' },
  { label: 'Province - Per Capita', value: 'province-capita' },
  { label: 'Sector - Absolute', value: 'sector-absolute' },
  { label: 'Sector - Per GDP', value: 'sector-gdp' },
  { label: 'Sector - Per Capita', value: 'sector-capita' },
  { label: 'Gas - Absolute', value: 'gas-absolute' },
  { label: 'Gas - Per GDP', value: 'gas-gdp' },
  { label: 'Gas - Per Capita', value: 'gas-capita' }
];

const getFieldOptions = field => createSelector(getMetadata, metadata => {
  if (!metadata || !metadata[field]) return null;
  return field === 'dataSource'
    ? metadata[field]
      .concat({ label: 'CAIT', value: '1' })
      .map(o => ({ name: o.label, value: String(o.value) }))
    : metadata[field].map(o => ({ label: o.label, value: String(o.value) }));
});

const getFilterOptions = createStructuredSelector({
  source: getFieldOptions('dataSource'),
  chartType: () => CHART_TYPE_OPTIONS,
  breakBy: () => BREAK_BY_OPTIONS,
  provinces: getFieldOptions('location'),
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas')
});

// DEFAULTS
const getDefaults = createSelector(getFilterOptions, options => ({
  source: findOption(options.source, 'SIGN SMART'),
  chartType: findOption(CHART_TYPE_OPTIONS, 'line'),
  breakBy: findOption(BREAK_BY_OPTIONS, 'province-absolute'),
  provinces: ALL_SELECTED_OPTION,
  sector: ALL_SELECTED_OPTION,
  gas: ALL_SELECTED_OPTION
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = query[field];
  return queryValue === ALL_SELECTED
    ? ALL_SELECTED_OPTION
    : findOption(getFilterOptions(state)[field], queryValue);
};

const getSelectedOptions = createStructuredSelector({
  source: getFieldSelected('source'),
  chartType: getFieldSelected('chartType'),
  breakBy: getFieldSelected('breakBy'),
  provinces: getFieldSelected('provinces'),
  sector: getFieldSelected('sector'),
  gas: getFieldSelected('gas')
});

// CHART DATA
// const getBreakByParam = createSelector(getSelectedOptions, options => {
//   if (!options || !options.source) return null;
//   const breakByArray = options.breakBy.value.split('-');
//   return { model: breakByArray[0], metric: breakByArray[1] };
// });
const getParam = (fieldName, data) => {
  if (!data) return {};
  if (!isArray(data) && data.value !== ALL_SELECTED)
    return { [fieldName]: data.value };
  if (isArray(data)) return { [fieldName]: data.map(f => f.value).join() };
  return {};
};

export const getEmissionParams = createSelector(
  [ getSelectedOptions ],
  options => {
    if (!options || !options.source || !options.gas) return null;
    const { source: selectedSource, gas } = options;
    return {
      location: COUNTRY_ISO,
      ...getParam('gas', gas),
      source: selectedSource.value
    };
  }
);

export const getGHGEmissions = createStructuredSelector({
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  emissionParams: getEmissionParams
});
