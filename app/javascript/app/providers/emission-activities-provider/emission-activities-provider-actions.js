import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchEmissionActivitiesInit = createAction(
  'fetchEmissionActivitiesInit'
);
export const fetchEmissionActivitiesReady = createAction(
  'fetchEmissionActivitiesReady'
);
export const fetchEmissionActivitiesFail = createAction(
  'fetchEmissionActivitiesFail'
);

export const fetchEmissionActivities = createThunkAction(
  'fetchEmissionActivities',
  () => (dispatch, state) => {
    const { emissionActivities } = state();
    if (!emissionActivities.loading) {
      dispatch(fetchEmissionActivitiesInit());
      INDOAPI
        .get('emission_activities')
        .then((data = {}) => {
          dispatch(fetchEmissionActivitiesReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchEmissionActivitiesFail(error && error.message));
        });
    }
  }
);
