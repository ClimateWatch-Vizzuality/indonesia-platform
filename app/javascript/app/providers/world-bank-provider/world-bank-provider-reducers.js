import * as actions from './world-bank-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchWorldBankInit]: state => ({ ...state, loading: true }),
  [actions.fetchWorldBankReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    data: { ...state.data, [payload.iso]: payload.data }
  }),
  [actions.fetchWorldBankFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
