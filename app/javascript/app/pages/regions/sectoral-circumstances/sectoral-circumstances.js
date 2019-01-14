import { connect } from 'react-redux';
import Component from './sectoral-circumstances-component';
import { getSectoralCircumstances } from './sectoral-circumstances-selectors';

const mapStateToProps = getSectoralCircumstances;

export default connect(mapStateToProps, null)(Component);
