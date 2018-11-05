import { connect } from 'react-redux';

import HomeComponent from './home-component';

const mapStateToProps = state => state;

export default connect(mapStateToProps, null)(HomeComponent);
