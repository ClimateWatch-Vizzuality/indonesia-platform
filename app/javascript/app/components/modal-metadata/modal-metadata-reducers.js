import * as actions from './modal-metadata-actions';

export const initialState = {
  loaded: false,
  loading: false,
  isOpen: false,
  customTitle: '',
  active: [],
  data: {}
};

const setModalMetadataParams = (state, { payload }) => ({
  ...state,
  isOpen: payload.open,
  active: typeof payload.slugs === 'string' ? [ payload.slugs ] : payload.slugs,
  customTitle: payload.customTitle || state.title
});

const setLoading = (state, loading) => ({ ...state, loading });
const setLoaded = (state, loaded) => ({ ...state, loaded });
const setData = (state, { data }) => {
  let slugData = {};
  slugData = data.reduce((acc, d) => ({ ...acc, [d.short_title]: d }), {});
  return { ...state, data: { ...state.data, ...slugData } };
};

export default {
  [actions.setModalMetadataParams]: setModalMetadataParams,
  [actions.fetchModalMetaDataInit]: state =>
    setLoading(setLoaded(state, false), true),
  [actions.fetchModalMetaDataReady]: (state, { payload }) =>
    setLoaded(setLoading(setData(state, payload), false), true)
};
