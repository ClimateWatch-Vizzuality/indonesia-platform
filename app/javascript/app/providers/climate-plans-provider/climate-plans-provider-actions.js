import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchClimatePlansInit = createAction('fetchClimatePlansInit');
export const fetchClimatePlansReady = createAction('fetchClimatePlansReady');
export const fetchClimatePlansFail = createAction('fetchClimatePlansFail');

export const fetchClimatePlans = createThunkAction(
  'fetchClimatePlans',
  params => (dispatch, state) => {
    const { climatePlans } = state();
    if (climatePlans && !climatePlans.loading) {
      dispatch(fetchClimatePlansInit());
      INDOAPI
        .get('province/climate_plans', params)
        .then((data = {}) => {
          dispatch(fetchClimatePlansReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchClimatePlansFail(error && error.message));
        });
    }
  }
);
