import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslation } from 'utils/translations';
import { getProvince } from 'selectors/provinces-selectors';
import { createTextSearchSelector } from 'selectors/util-selectors';

export const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

const getQuery = ({ location }) => location && (location.query || null);

const getClimateSectoralPlan = ({ climatePlans }) =>
  climatePlans && climatePlans.data;

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

const getTranslatedContent = createSelector([ getSectionsContent ], data => {
  if (!data) return null;
  const sectionSlug = 'climate-sectoral-plan-section';
  return {
    title: getTranslation(data, sectionSlug, 'title'),
    description: getTranslation(data, sectionSlug, 'description')
  };
});

export const getClimateSectoralPlanData = createStructuredSelector({
  translations: getTranslatedContent,
  provinceIso: getProvince,
  data: createTextSearchSelector(getClimateSectoralPlan, getSearch)
});
