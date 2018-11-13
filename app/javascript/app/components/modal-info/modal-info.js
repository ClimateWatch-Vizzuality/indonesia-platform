import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import * as actions from './modal-info-actions';
import reducers, { initialState } from './modal-info-reducers';

import ModalInfoComponent from './modal-info-component';

const mapStateToProps = ({ modalInfo }) => ({ isOpen: modalInfo.isOpen });

const includeActions = withHandlers({
  onRequestClose: ({ setOpen }) => () => {
    setOpen(false);
  }
});

export const reduxModule = { actions, reducers, initialState };

export default connect(mapStateToProps, actions)(
  includeActions(ModalInfoComponent)
);
