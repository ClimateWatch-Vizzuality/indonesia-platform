import { createAction, createThunkAction } from 'redux-tools';
import { CWAPI } from 'services/api';

const { COUNTRY_ISO } = process.env;

export const fetchTimelineInit = createAction('fetchTimelineInit');
export const fetchTimelineFail = createAction('fetchTimelineFail');
export const fetchTimelineReady = createAction('fetchTimelineReady');

export const fetchTimeline = createThunkAction('fetchTimeline', params =>
  (dispatch, state) => {
    const { data } = state().timeline;

    if (!data.loading) {
      dispatch(fetchTimelineInit());
      CWAPI
        .get(`/timeline/${COUNTRY_ISO}`, params)
        .then((d = {}) => {
          dispatch(fetchTimelineReady(d));
        })
        .catch(error => {
          console.warn(error);
          dispatch(fetchTimelineFail(error && error.message));
        });
    }
  });
