import { createStructuredSelector, createSelector } from 'reselect';
import { createTextSearchSelector } from 'selectors/util-selectors';
import { getProvince } from 'selectors/provinces-selectors';

export const getSectionsContent = ({ SectionsContent }) =>
  SectionsContent && SectionsContent.data;

const getQuery = ({ location }) => location && (location.query || null);

export const getDevelopmentPlansData = ({ developmentPlans }) =>
  developmentPlans && developmentPlans.data;

const getSearch = createSelector(getQuery, query => {
  if (!query || !query.search) return null;
  return query.search;
});

const parsedDevelopmentPlansData = createSelector(
  getDevelopmentPlansData,
  developmentPlans => {
    if (!developmentPlans) return null;

    const supportivePolicyDirections = developmentPlans[0] &&
      developmentPlans[0].supportive_policy_directions;
    const withPeriod = supportivePolicyDirections &&
      supportivePolicyDirections.map(policy => ({
        sector: policy.sector,
        supportive_policy_direction_in_RPJMD: policy.value,
        RPJMD_period: developmentPlans[0].rpjmd_period
      }));

    return withPeriod;
  }
);

export const getDevelopmentPlans = createStructuredSelector({
  data: createTextSearchSelector(parsedDevelopmentPlansData, getSearch),
  query: getQuery,
  provinceIso: getProvince
});
