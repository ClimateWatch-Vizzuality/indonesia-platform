import { connect } from 'react-redux';
import { setLanguage } from './root-actions';

import Component from './root-component';

const mapStateToProps = ({ location }) => ({
  route: location.routesMap[location.type],
  location: location,
  locale: location.payload && location.payload.locale
});

const actions = dispatch => ({
  onChangeLanguage: locale => dispatch(setLanguage(locale))
});

export default connect(mapStateToProps, actions)(Component);
