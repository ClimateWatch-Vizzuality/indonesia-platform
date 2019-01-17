import { connect } from 'react-redux';

import Component from './ghg-map-component';
import { getMap } from './ghg-map-selectors';

const mapStateToProps = getMap;

export default connect(mapStateToProps)(Component);
