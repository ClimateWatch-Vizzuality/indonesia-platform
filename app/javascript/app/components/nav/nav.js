import { connect } from 'react-redux';
import { provincesDetails } from 'selectors/provinces-selectors';
import { getLocale, getTranslate } from 'selectors/translation-selectors';
import Component from './nav-component';

const mapStateToProps = state => ({
  provinceInfo: provincesDetails(state) && provincesDetails(state).provinceInfo,
  locale: getLocale(state),
  t: getTranslate(state)
});

export default connect(mapStateToProps, null)(Component);
