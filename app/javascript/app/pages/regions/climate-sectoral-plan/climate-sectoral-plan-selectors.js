import { createStructuredSelector, createSelector } from 'reselect';
import { getProvince } from 'selectors/provinces-selectors';
import { getTranslate } from 'selectors/translation-selectors';
import {
  getDevelopmentPlansData
} from './development-plans/development-plans-selectors';

const DEFAULT_OPTION = 'development-plans';

const getQuery = ({ location }) => location && (location.query || null);

const getSubheaderDescriptionForDevelopmentPlans = createSelector(
  getDevelopmentPlansData,
  developmentPlans => {
    if (!developmentPlans) return null;

    return developmentPlans[0] &&
      developmentPlans[0].supportive_mission_statement;
  }
);

const getSelectedOption = createSelector(getQuery, query => {
  if (!query || !query.plans) return DEFAULT_OPTION;
  return query.plans;
});

export const getClimateSectoralPlanData = createStructuredSelector({
  t: getTranslate,
  provinceIso: getProvince,
  query: getQuery,
  subheaderDescription: getSubheaderDescriptionForDevelopmentPlans,
  selectedOption: getSelectedOption
});
