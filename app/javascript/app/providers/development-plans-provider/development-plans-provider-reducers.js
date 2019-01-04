import * as actions from './development-plans-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchDevelopmentPlansInit]: state => ({ ...state, loading: true }),
  [actions.fetchDevelopmentPlansReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchDevelopmentPlans]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
