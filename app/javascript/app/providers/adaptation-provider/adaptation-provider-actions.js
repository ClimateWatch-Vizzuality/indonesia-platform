import { createAction, createThunkAction } from 'redux-tools';
import { INDOAPI } from 'services/api';

export const fetchAdaptationInit = createAction('fetchAdaptationInit');
export const fetchAdaptationReady = createAction('fetchAdaptationReady');
export const fetchAdaptationFail = createAction('fetchAdaptationFail');

export const fetchAdaptation = createThunkAction('fetchAdaptation', params =>
  (dispatch, state) => {
    const { adaptation } = state();
    if (!adaptation.loading) {
      dispatch(fetchAdaptationInit());
      INDOAPI
        .get('indicators', params)
        .then((data = {}) => {
          dispatch(fetchAdaptationReady(data));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchAdaptationFail(error && error.message));
        });
    }
  });
