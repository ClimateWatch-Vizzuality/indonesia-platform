import { createAction, createThunkAction } from 'redux-tools';
import { CWAPI } from 'services/api';

const { COUNTRY_ISO } = process.env;

export const getNdcContentOverviewInit = createAction(
  'getNdcContentOverviewInit'
);
export const getNdcContentOverviewFail = createAction(
  'getNdcContentOverviewFail'
);
export const getNdcContentOverviewReady = createAction(
  'getNdcContentOverviewReady'
);

export const getNdcContentOverview = createThunkAction(
  'getNdcContentOverview',
  params => (dispatch, state) => {
    const { data } = state().ndcContentOverview;

    if (!data.loading) {
      dispatch(getNdcContentOverviewInit());
      CWAPI
        .get(`ndcs/${COUNTRY_ISO}/content_overview`, params)
        .then((d = {}) => {
          dispatch(getNdcContentOverviewReady(d));
        })
        .catch(error => {
          console.warn(error);
          dispatch(getNdcContentOverviewFail(error && error.message));
        });
    }
  }
);
