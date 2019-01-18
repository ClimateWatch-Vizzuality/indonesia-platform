import { connect } from 'react-redux';
import Component from './timeline-component';
import { getTimeline } from './timeline-selectors';

const mapStateToProps = getTimeline;

export default connect(mapStateToProps, null)(Component);
