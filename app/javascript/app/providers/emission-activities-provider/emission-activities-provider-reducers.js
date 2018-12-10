import * as actions from './emission-activities-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchEmissionActivitiesInit]: state => ({ ...state, loading: true }),
  [actions.fetchEmissionActivitiesReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchEmissionActivitiesFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
