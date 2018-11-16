import * as actions from './ghg-emissions-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchGHGEmissionsInit]: state => ({ ...state, loading: true }),
  [actions.fetchGHGEmissionsReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchGHGEmissionsFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
