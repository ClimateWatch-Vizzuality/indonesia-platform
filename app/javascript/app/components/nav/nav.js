import { connect } from 'react-redux';
import { provincesDetails } from 'selectors/provinces-selectors';
import { getLocale } from 'selectors/translation-selectors';
import Component from './nav-component';

const mapStateToProps = state => {
  const { SectionsContent } = state;
  return {
    content: SectionsContent.data,
    provinceInfo: provincesDetails(state) &&
      provincesDetails(state).provinceInfo,
    locale: getLocale(state)
  };
};

export default connect(mapStateToProps, null)(Component);
