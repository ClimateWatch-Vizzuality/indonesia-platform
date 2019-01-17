import { connect } from 'react-redux';
import Component from './overview-component';
import { getOverview } from './overview-selectors';

const mapStateToProps = getOverview;

export default connect(mapStateToProps, null)(Component);
