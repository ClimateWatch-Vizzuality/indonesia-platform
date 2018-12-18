import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { getLocale } from 'selectors/translation-selectors';
import DataProvider from './data-provider';

function LocalizedProvider(props) {
  const { locale, params } = props;
  const newParams = { ...params, locale };

  return <DataProvider {...props} params={newParams} />;
}

LocalizedProvider.propTypes = {
  locale: PropTypes.string.isRequired,
  params: PropTypes.object
};

LocalizedProvider.defaultProps = { params: {} };

const mapStateToProps = state => ({ locale: getLocale(state) });
export default connect(mapStateToProps, null)(LocalizedProvider);
