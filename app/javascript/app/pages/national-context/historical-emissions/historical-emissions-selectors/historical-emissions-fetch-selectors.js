import isArray from 'lodash/isArray';
import { createSelector } from 'reselect';
import { ALL_SELECTED } from 'constants/constants';
import { getSelectedOptions } from './historical-emissions-filter-selectors';

const { COUNTRY_ISO } = process.env;

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
    if (!options || !options.source) return null;
    const { source: selectedSource, gas } = options;
    return {
      location: COUNTRY_ISO,
      ...getParam('gas', gas),
      source: selectedSource.value
    };
  }
);
