import * as actions from './indicators-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchIndicatorsInit]: state => ({ ...state, loading: true }),
  [actions.fetchIndicatorsReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchIndicatorsFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
