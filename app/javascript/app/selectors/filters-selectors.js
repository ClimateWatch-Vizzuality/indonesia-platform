import { createSelector } from 'reselect';
import castArray from 'lodash/castArray';

import { ALL_SELECTED } from 'constants';
import { getTranslate } from 'selectors/translation-selectors';

export const getQuery = ({ location }) => location && location.query || null;

export const getFieldQuery = field => createSelector([ getQuery ], query => {
  if (!query || !query[field]) return null;
  return String(query[field]);
});

export const findOption = (
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

export const withAllSelected = filterOptions =>
  createSelector(
    [ getAllSelectedOption, filterOptions ],
    (allSelectedOption, options) =>
      options && options.length > 1
        ? [ allSelectedOption, ...options ]
        : options
  );
