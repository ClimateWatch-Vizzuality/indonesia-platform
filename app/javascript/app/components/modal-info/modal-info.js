import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import * as actions from './modal-info-actions';
import * as reducers from './modal-info-reducers';

import ModalInfoComponent from './modal-info-component';

const { initialState } = reducers;

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
