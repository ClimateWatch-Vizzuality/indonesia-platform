import * as actions from './funding-oportunities-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchFundingOportunitiesInit]: state => ({
    ...state,
    loading: true
  }),
  [actions.fetchFundingOportunitiesReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: payload
  }),
  [actions.fetchFundingOportunitiesFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
