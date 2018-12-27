import { connect } from 'react-redux';
import Component from './regions-select-component';
import { getProvincesData } from './regions-select-selectors';

const mapStateToProps = getProvincesData;

export default connect(mapStateToProps, null)(Component);
