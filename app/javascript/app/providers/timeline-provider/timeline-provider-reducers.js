import * as actions from './timeline-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchTimelineInit]: state => ({ ...state, loading: true }),
  [actions.fetchTimelineReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchTimelineFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
