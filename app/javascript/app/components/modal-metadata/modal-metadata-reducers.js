import * as actions from './modal-metadata-actions';

export const initialState = { isOpen: false, customTitle: '', active: [] };

const setModalMetadataParams = (state, { payload }) => ({
  ...state,
  isOpen: payload.open,
  active: typeof payload.slugs === 'string' ? [ payload.slugs ] : payload.slugs,
  customTitle: payload.customTitle || state.title
});

export default { [actions.setModalMetadataParams]: setModalMetadataParams };
