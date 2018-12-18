import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './sections-content-provider-actions';
import reducers, { initialState } from './sections-content-provider-reducers';

function SectionsContentProvider({ fetchSectionsContent }) {
  return <LocalizedProvider fetchData={fetchSectionsContent} />;
}

SectionsContentProvider.propTypes = {
  fetchSectionsContent: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(SectionsContentProvider);
