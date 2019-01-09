import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchDevelopmentPlansInit = createAction(
  'fetchDevelopmentPlansInit'
);
export const fetchDevelopmentPlansReady = createAction(
  'fetchDevelopmentPlansReady'
);
export const fetchDevelopmentPlansFail = createAction(
  'fetchDevelopmentPlansFail'
);

export const fetchDevelopmentPlans = createThunkAction(
  'fetchDevelopmentPlans',
  params => (dispatch, state) => {
    const { developmentPlans } = state();
    if (developmentPlans && !developmentPlans.loading) {
      dispatch(fetchDevelopmentPlansInit());
      INDOAPI
        .get('province/development_plans', params)
        .then((data = {}) => {
          dispatch(fetchDevelopmentPlansReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchDevelopmentPlansFail(error && error.message));
        });
    }
  }
);
