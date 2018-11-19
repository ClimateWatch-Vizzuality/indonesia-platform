import { connect } from 'react-redux';
import Component from './nav-component';

const mapStateToProps = ({ SectionsContent }) => ({
  content: SectionsContent.data
});

export default connect(mapStateToProps, null)(Component);
