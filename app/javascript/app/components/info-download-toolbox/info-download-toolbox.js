import { connect } from 'react-redux';
import {
  setModalMetadata
} from 'components/modal-metadata/modal-metadata-actions';
import Component from './info-download-toolbox-component';

const actions = { setModalMetadata };

export default connect(null, actions)(Component);
