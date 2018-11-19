import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import { LANGUAGES_AVAILABLE } from 'constants/languages';
import NationalSections from './sections/national-context';
import ClimateGoalsSections from './sections/climate-goals';

const history = createHistory();
const DEFAULT_LANGUAGE = 'en';
const AVAILABLE_LOCALES = LANGUAGES_AVAILABLE.map(lang => lang.value);

export const HOME = 'location/HOME';
export const NATIONAL_CONTEXT = 'location/NATIONAL_CONTEXT';
export const CLIMATE_GOALS = 'location/CLIMATE_GOALS';

export const routes = {
  [HOME]: {
    nav: false,
    label: 'Overview',
    path: '/:locale?',
    component: 'pages/home/home'
  },
  [NATIONAL_CONTEXT]: {
    nav: true,
    label: 'National Context',
    link: '/:locale/national-context',
    path: '/:locale/national-context/:section?',
    component: 'layouts/sections/sections',
    sections: NationalSections,
    description: 'This section provides context for Indonesias’s climate change response, including information on provincial development priorities, population, economy, energy, and climate risks from natural disasters.'
  },
  [CLIMATE_GOALS]: {
    nav: true,
    label: 'Climate Goals',
    link: '/:locale/climate-goals',
    path: '/:locale/climate-goals/:section?',
    component: 'layouts/sections/sections',
    sections: ClimateGoalsSections,
    description: 'This section provides context for Indonesias’s climate change response, including information on provincial development priorities, population, economy, energy, and climate risks from natural disasters.'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => {
      dispatch(
        redirect({ type: 'HOME', payload: { locale: DEFAULT_LANGUAGE } })
      );
    }
  }
};
const onBeforeChange = (dispatch, getState, { action }) => {
  const { locale } = action.payload;

  const { type } = action;
  const language = getState().location.payload.locale || DEFAULT_LANGUAGE;
  if (!AVAILABLE_LOCALES.includes(locale)) {
    dispatch(
      redirect({ type, payload: { ...action.payload, locale: language } })
    );
  }
};
export default connectRoutes(history, routes, {
  querySerializer: queryString,
  onBeforeChange
});
