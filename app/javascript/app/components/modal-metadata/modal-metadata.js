import { connect } from 'react-redux';
import { withHandlers } from 'recompose';
import * as actions from './modal-metadata-actions';

import { getModalMetadata } from './modal-metadata-selectors';
import reducers, { initialState } from './modal-metadata-reducers';
import ModalMetadataComponent from './modal-metadata-component';

const includeActions = withHandlers({
  onRequestClose: ({ setModalMetadata }) => () => {
    setModalMetadata({ open: false });
  }
});

export const reduxModule = { actions, reducers, initialState };

export default connect(getModalMetadata, actions)(
  includeActions(ModalMetadataComponent)
);
