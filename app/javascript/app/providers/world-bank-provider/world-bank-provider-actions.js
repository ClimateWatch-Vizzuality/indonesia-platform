import { createAction, createThunkAction } from 'redux-tools';
import { CWAPI } from 'services/api';

import isEmpty from 'lodash/isEmpty';

export const fetchWorldBankInit = createAction('fetchWorldBankInit');
export const fetchWorldBankReady = createAction('fetchWorldBankReady');
export const fetchWorldBankFail = createAction('fetchWorldBankFail');

export const fetchWorldBank = createThunkAction('fetchWorldBank', ({ iso }) =>
  (dispatch, state) => {
    const { WorldBank } = state();
    if (WorldBank && isEmpty(WorldBank.data) && !WorldBank.loading) {
      dispatch(fetchWorldBankInit());
      CWAPI
        .get(`wb_extra/${iso}`)
        .then(data => {
          if (data) {
            dispatch(fetchWorldBankReady({ data, iso }));
          } else {
            dispatch(fetchWorldBankReady({}));
          }
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchWorldBankFail(error && error.message));
        });
    }
  });
