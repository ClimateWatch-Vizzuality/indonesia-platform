import * as actions from './adaptation-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchAdaptationInit]: state => ({ ...state, loading: true }),
  [actions.fetchAdaptationReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchAdaptationFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
