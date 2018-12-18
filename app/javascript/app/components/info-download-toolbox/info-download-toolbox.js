import { connect } from 'react-redux';
import {
  setModalMetadata
} from 'components/modal-metadata/modal-metadata-actions';
import { getLocale } from 'selectors/translation-selectors';
import Component from './info-download-toolbox-component';

const actions = { setModalMetadata };

const mapStateToProps = state => ({ locale: getLocale(state) });
export default connect(mapStateToProps, actions)(Component);
