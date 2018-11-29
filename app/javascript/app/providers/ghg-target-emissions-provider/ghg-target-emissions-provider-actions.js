import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchGHGTargetEmissionsInit = createAction(
  'fetchGHGTargetEmissionsInit'
);
export const fetchGHGTargetEmissionsReady = createAction(
  'fetchGHGTargetEmissionsReady'
);
export const fetchGHGTargetEmissionsFail = createAction(
  'fetchGHGTargetEmissionsFail'
);

export const fetchGHGTargetEmissions = createThunkAction(
  'fetchGHGTargetEmissions',
  params => (dispatch, state) => {
    const { GHGTargetEmissions } = state();
    if (!GHGTargetEmissions.loading) {
      dispatch(fetchGHGTargetEmissionsInit());
      INDOAPI
        .get('emission_targets', params)
        .then((data = {}) => {
          dispatch(fetchGHGTargetEmissionsReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchGHGTargetEmissionsFail(error && error.message));
        });
    }
  }
);
