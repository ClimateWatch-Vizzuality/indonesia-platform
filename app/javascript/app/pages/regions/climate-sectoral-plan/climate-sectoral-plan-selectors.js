import { createStructuredSelector, createSelector } from 'reselect';
import { getTranslation } from 'utils/translations';
import { getProvince } from 'selectors/provinces-selectors';
import isEmpty from 'lodash/isEmpty';
import { lowerDeburr } from 'utils/utils';

export const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

const getQuery = ({ location }) => location && (location.query || null);

const getClimateSectoralPlan = ({ climatePlans }) =>
  climatePlans && climatePlans.data;

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

export const getFilteredDataBySearch = createSelector(
  [ getClimateSectoralPlan, getSearch ],
  (data, search) => {
    if (!data || isEmpty(data)) return [];
    if (!search || isEmpty(search)) return data;
    const updatedData = data;
    return updatedData.filter(
      d => Object.keys(d).some(key => {
        if (Object.prototype.hasOwnProperty.call(d, key) && d[key] !== null) {
          return lowerDeburr(String(d[key])).indexOf(lowerDeburr(search)) > -1;
        }
        return false;
      })
    );
  }
);

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
  data: getFilteredDataBySearch
});
