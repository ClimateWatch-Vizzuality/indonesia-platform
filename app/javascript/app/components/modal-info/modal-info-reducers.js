import * as actions from './modal-info-actions';

export const initialState = { isOpen: false };

const setOpen = (state, { payload }) => ({ ...state, isOpen: payload });

export default { [actions.setOpen]: setOpen };
