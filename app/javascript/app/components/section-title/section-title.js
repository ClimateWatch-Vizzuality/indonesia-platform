import { connect } from 'react-redux';
import { setOpen } from 'components/modal-info/modal-info-actions';
import Component from './section-title-component';

const actions = { setOpen };

export default connect(null, actions)(Component);
