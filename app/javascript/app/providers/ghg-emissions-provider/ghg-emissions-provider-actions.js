import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI, CWAPI } from 'services/api';
import { API, METRIC } from 'constants';

export const fetchGHGEmissionsInit = createAction('fetchGHGEmissionsInit');
export const fetchGHGEmissionsReady = createAction('fetchGHGEmissionsReady');
export const fetchGHGEmissionsFail = createAction('fetchGHGEmissionsFail');

const normalizeCWAPIData = data =>
  data.map(d => ({ ...d, metric: METRIC.absolute }));

export const fetchGHGEmissions = createThunkAction(
  'fetchGHGEmissions',
  params => (dispatch, state) => {
    const { GHGEmissions } = state();
    if (!GHGEmissions.loading) {
      dispatch(fetchGHGEmissionsInit());
      const { api, ...paramsWithoutAPI } = params;
      const cwAPI = api === API.cw;
      (cwAPI ? CWAPI : INDOAPI)
        .get('emissions', paramsWithoutAPI)
        .then((data = {}) => {
          dispatch(
            fetchGHGEmissionsReady(cwAPI ? normalizeCWAPIData(data) : data)
          );
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchGHGEmissionsFail(error && error.message));
        });
    }
  }
);
