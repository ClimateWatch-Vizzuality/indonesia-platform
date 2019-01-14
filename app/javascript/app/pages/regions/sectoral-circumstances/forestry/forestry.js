import { connect } from 'react-redux';
import Component from './forestry-component';
import { getForestryData } from './forestry-selectors';

const mapStateToProps = getForestryData;

export default connect(mapStateToProps, null)(Component);
