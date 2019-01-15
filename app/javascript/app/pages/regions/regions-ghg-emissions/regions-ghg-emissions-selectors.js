import { createStructuredSelector, createSelector } from 'reselect';
import castArray from 'lodash/castArray';
import { ALL_SELECTED } from 'constants/constants';

import { getProvince } from 'selectors/provinces-selectors';
import { getTranslate } from 'selectors/translation-selectors';

const getQuery = ({ location }) => location && (location.query || null);

export const getMetadata = ({ metadata }) =>
  metadata && metadata.ghg && metadata.ghg.data;
export const getEmissionsData = ({ GHGEmissions }) =>
  GHGEmissions && GHGEmissions.data;
export const getTargetEmissionsData = ({ GHGTargetEmissions }) =>
  GHGTargetEmissions && GHGTargetEmissions.data;

const SOURCE = 'SIGN SMART';
const getSource = createSelector(getMetadata, meta => {
  if (!meta || !meta.dataSource) return null;
  const selected = meta.dataSource.find(source => source.label === SOURCE);
  return selected && selected.value;
});

const findOption = (
  options,
  value,
  findBy = [ 'name', 'value', 'code', 'label' ]
) =>
  options && options
      .filter(o => o)
      .find(
        o => castArray(findBy).some(key => String(o[key]) === String(value))
      );

export const getAllSelectedOption = createSelector([ getTranslate ], t => ({
  value: ALL_SELECTED,
  label: t('common.all-selected-option'),
  override: true
}));

const getFieldOptions = field => createSelector([ getMetadata ], metadata => {
  if (!metadata || !metadata[field]) return null;

  return metadata[field]
    .map(o => ({ label: o.label, value: String(o.value), code: o.code }))
    .filter(o => o);
});

export const getFilterOptions = createStructuredSelector({
  sector: getFieldOptions('sector'),
  gas: getFieldOptions('gas'),
  metric: getFieldOptions('metric')
});

// DEFAULTS
const getDefaults = createSelector([ getFilterOptions, getAllSelectedOption ], (
  options,
  allSelectedOption
) => ({
  sector: allSelectedOption,
  gas: allSelectedOption,
  metric: options && options.metric && options.metric[0]
}));

// SELECTED
const getFieldSelected = field => state => {
  const { query } = state.location;
  if (!query || !query[field]) return getDefaults(state)[field];
  const queryValue = String(query[field]);
  if (queryValue === ALL_SELECTED) return getAllSelectedOption(state);
  const findSelectedOption = value =>
    findOption(getFilterOptions(state)[field], value);
  return queryValue.includes(',')
    ? queryValue.split(',').map(v => findSelectedOption(v))
    : findSelectedOption(queryValue);
};

export const getSelectedOptions = createStructuredSelector({
  metric: getFieldSelected('metric'),
  sector: getFieldSelected('sector'),
  gas: getFieldSelected('gas')
});

export const getEmissionParams = createSelector([ getSource, getProvince ], (
  source,
  location
) =>
  {
    if (!source) return null;
    return { location, source };
  });

export const getGHGEmissions = createStructuredSelector({
  emissionParams: getEmissionParams,
  selectedOptions: getSelectedOptions,
  filterOptions: getFilterOptions,
  query: getQuery,
  allSelectedOption: getAllSelectedOption,
  provinceISO: getProvince,
  t: getTranslate
});
