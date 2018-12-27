import * as actions from './locations-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchLocationsInit]: state => ({ ...state, loading: true }),
  [actions.fetchLocationsReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchLocationsFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
