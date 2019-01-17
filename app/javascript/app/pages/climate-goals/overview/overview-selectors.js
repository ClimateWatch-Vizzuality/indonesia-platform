import { createStructuredSelector, createSelector } from 'reselect';
import groupBy from 'lodash/groupBy';
import { getTranslate } from 'selectors/translation-selectors';

const getOverviewData = ({ ndcContentOverview }) =>
  ndcContentOverview && ndcContentOverview.data;

const getOverviewValues = createSelector(getOverviewData, overview => {
  if (!overview) return null;

  return overview.values;
});

const getOverviewSectors = createSelector(getOverviewData, overview => {
  if (!overview) return null;

  return overview.sectors;
});

const getValuesGrouped = createSelector(getOverviewValues, values => {
  if (!values || !values.length) return null;

  const groupedValues = groupBy(values, 'slug');
  Object.keys(groupedValues).forEach(key => {
    if (!groupedValues[key].length) groupedValues[key] = null;
  });
  return groupedValues;
});

export const getOverview = createStructuredSelector({
  values: getValuesGrouped,
  sectors: getOverviewSectors,
  t: getTranslate
});
