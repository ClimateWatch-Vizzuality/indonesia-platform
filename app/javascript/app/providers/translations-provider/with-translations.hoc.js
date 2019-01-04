import React from 'react';
import { getTranslate } from 'selectors/translation-selectors';

import { connect } from 'react-redux';

export default function withTranslations(WrappedComponent) {
  const WithTranslationsComponent = props => <WrappedComponent {...props} />;

  const mapStateToProps = state => ({ t: getTranslate(state) });

  return connect(mapStateToProps, null)(WithTranslationsComponent);
}
