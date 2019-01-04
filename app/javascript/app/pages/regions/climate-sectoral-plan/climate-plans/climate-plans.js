import { connect } from 'react-redux';
import Component from './climate-plans-component';
import { getClimatePlans } from './climate-plans-selectors';

const mapStateToProps = getClimatePlans;

export default connect(mapStateToProps, null)(Component);
