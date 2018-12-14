import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchIndicatorsInit = createAction('fetchIndicatorsInit');
export const fetchIndicatorsReady = createAction('fetchIndicatorsReady');
export const fetchIndicatorsFail = createAction('fetchIndicatorsFail');

export const fetchIndicators = createThunkAction('fetchIndicators', params =>
  (dispatch, state) => {
    const { indicators } = state();
    if (!indicators.loading) {
      dispatch(fetchIndicatorsInit());
      INDOAPI
        .get('indicators', params)
        .then((data = {}) => {
          dispatch(fetchIndicatorsReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchIndicatorsFail(error && error.message));
        });
    }
  });
