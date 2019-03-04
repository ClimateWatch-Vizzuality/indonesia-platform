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
  params => dispatch => {
    const timestamp = new Date();
    dispatch(fetchGHGEmissionsInit({ timestamp }));
    const { api, ...paramsWithoutAPI } = params;
    const cwAPI = api === API.cw;
    (cwAPI ? CWAPI : INDOAPI)
      .get('emissions', paramsWithoutAPI)
      .then((data = {}) => {
        dispatch(
          fetchGHGEmissionsReady({
            data: cwAPI ? normalizeCWAPIData(data) : data,
            timestamp
          })
        );
      })
      .catch(error => {
        console.warn(error);
        dispatch(
          fetchGHGEmissionsFail({ error: error && error.message, timestamp })
        );
      });
  }
);
