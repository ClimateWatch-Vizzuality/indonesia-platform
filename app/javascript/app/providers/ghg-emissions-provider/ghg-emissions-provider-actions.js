import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchGHGEmissionsInit = createAction('fetchGHGEmissionsInit');
export const fetchGHGEmissionsReady = createAction('fetchGHGEmissionsReady');
export const fetchGHGEmissionsFail = createAction('fetchGHGEmissionsFail');

export const fetchGHGEmissions = createThunkAction(
  'fetchGHGEmissions',
  params => (dispatch, state) => {
    const { GHGEmissions } = state();
    if (!GHGEmissions.loading) {
      dispatch(fetchGHGEmissionsInit());
      INDOAPI
        .get('emissions', params)
        .then((data = {}) => {
          dispatch(fetchGHGEmissionsReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchGHGEmissionsFail(error && error.message));
        });
    }
  }
);
