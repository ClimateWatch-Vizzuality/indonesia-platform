import { createStructuredSelector, createSelector } from 'reselect';
import { getProvince } from 'selectors/provinces-selectors';
import { getTranslate } from 'selectors/translation-selectors';
import { createTextSearchSelector } from 'selectors/util-selectors';

const getQuery = ({ location }) => location && (location.query || null);

const getClimateSectoralPlan = ({ climatePlans }) =>
  climatePlans && climatePlans.data;

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

export const getClimateSectoralPlanData = createStructuredSelector({
  t: getTranslate,
  provinceIso: getProvince,
  data: createTextSearchSelector(getClimateSectoralPlan, getSearch)
});
