import * as actions from './ghg-target-emissions-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchGHGTargetEmissionsInit]: state => ({ ...state, loading: true }),
  [actions.fetchGHGTargetEmissionsReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchGHGTargetEmissionsFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
