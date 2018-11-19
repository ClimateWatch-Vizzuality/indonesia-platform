import * as actions from './sections-content-provider-actions';

export const initialState = {
  loading: false,
  loaded: false,
  data: {},
  error: false
};

export default {
  [actions.fetchSectionsContentInit]: state => ({ ...state, loading: true }),
  [actions.fetchSectionsContentReady]: (
    state,
    { payload: { sectionsContentMapped } }
  ) => ({
    ...state,
    loading: false,
    loaded: true,
    data: sectionsContentMapped
  }),
  [actions.fetchSectionsContentFail]: (state, { payload }) => ({
    ...state,
    loading: false,
    error: payload
  })
};
