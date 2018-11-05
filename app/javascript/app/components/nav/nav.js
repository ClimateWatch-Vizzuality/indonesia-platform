import { connect } from 'react-redux';

import Component from './nav-component';

const mapStateToProps = ({ location }) => ({
  routes: Object.values(location.routesMap).filter(r => !!r.nav)
});

export default connect(mapStateToProps, null)(Component);
