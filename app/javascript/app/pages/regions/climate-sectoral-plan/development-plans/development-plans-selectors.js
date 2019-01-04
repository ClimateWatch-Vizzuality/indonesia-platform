import { createStructuredSelector, createSelector } from 'reselect';
import { createTextSearchSelector } from 'selectors/util-selectors';

export const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

const getQuery = ({ location }) => location && (location.query || null);

const getDevelopmentPlansData = ({ developmentPlans }) =>
  developmentPlans && developmentPlans.data;

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

export const getDevelopmentPlans = createStructuredSelector({
  data: createTextSearchSelector(getDevelopmentPlansData, getSearch)
});
