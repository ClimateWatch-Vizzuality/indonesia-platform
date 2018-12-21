import * as actions from './climate-plans-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchClimatePlansInit]: state => ({ ...state, loading: true }),
  [actions.fetchClimatePlansReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchClimatePlans]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
