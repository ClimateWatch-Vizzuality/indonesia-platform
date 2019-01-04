import { connect } from 'react-redux';
import Component from './development-plans-component';
import { getDevelopmentPlans } from './development-plans-selectors';

const mapStateToProps = getDevelopmentPlans;

export default connect(mapStateToProps, null)(Component);
