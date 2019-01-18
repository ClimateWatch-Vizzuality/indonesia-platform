import * as actions from './ndc-content-overview-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.getNdcContentOverviewInit]: state => ({ ...state, loading: true }),
  [actions.getNdcContentOverviewReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.getNdcContentOverviewFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
