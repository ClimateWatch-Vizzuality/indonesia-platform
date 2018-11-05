import { connectRoutes, NOT_FOUND, redirect } from 'redux-first-router';
import createHistory from 'history/createBrowserHistory';
import queryString from 'query-string';

const history = createHistory();

export const HOME = 'location/HOME';

export const routes = {
  [HOME]: {
    nav: false,
    label: 'Overview',
    path: '/',
    component: 'pages/home/home'
  },
  [NOT_FOUND]: {
    path: '/404',
    thunk: dispatch => dispatch(redirect({ type: HOME }))
  }
};

export default connectRoutes(history, routes, { querySerializer: queryString });
