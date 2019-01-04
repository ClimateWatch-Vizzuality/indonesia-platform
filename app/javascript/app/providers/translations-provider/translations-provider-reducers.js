import * as actions from './translations-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchTranslationsInit]: state => ({ ...state, loading: true }),
  [actions.fetchTranslationsReady]: (state, { payload }) => ({
    ...state,
    loading: false,
    loaded: true,
    data: payload
  }),
  [actions.fetchTranslationsFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
