import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';
import NationalSections from './sections/national-context';
import ClimateGoalsSections from './sections/climate-goals';

const history = createHistory();

export const HOME = 'location/HOME';
export const NATIONAL_CONTEXT = 'location/NATIONAL_CONTEXT';
export const CLIMATE_GOALS = 'location/CLIMATE_GOALS';

export const routes = {
  [HOME]: {
    nav: false,
    label: 'Overview',
    path: '/',
    component: 'pages/home/home'
  },
  [NATIONAL_CONTEXT]: {
    nav: true,
    label: 'National Context',
    link: '/national-context',
    path: '/national-context/:section?',
    component: 'layouts/sections/sections',
    sections: NationalSections,
    description: 'This section provides context for Indonesias’s climate change response, including information on provincial development priorities, population, economy, energy, and climate risks from natural disasters.'
  },
  [CLIMATE_GOALS]: {
    nav: true,
    label: 'Climate Goals',
    link: '/climate-goals',
    path: '/climate-goals/:section?',
    component: 'layouts/sections/sections',
    sections: ClimateGoalsSections,
    description: 'This section provides context for Indonesias’s climate change response, including information on provincial development priorities, population, economy, energy, and climate risks from natural disasters.'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: HOME }))
  }
};
export default connectRoutes(history, routes, { querySerializer: queryString });
