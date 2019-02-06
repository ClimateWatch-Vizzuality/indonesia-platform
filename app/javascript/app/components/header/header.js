import { connect } from 'react-redux';
import Component from './header-component';
import { setLanguage } from './header-actions';

const mapStateToProps = ({ location }) => ({
  routes: Object.values(location.routesMap).filter(r => !!r.nav),
  locale: location.payload && location.payload.locale
});

const actions = dispatch => ({
  onChangeLanguage: locale => dispatch(setLanguage(locale))
});

export default connect(mapStateToProps, actions)(Component);
