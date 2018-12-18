import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ghg-emissions-provider-actions';
import reducers, { initialState } from './ghg-emissions-provider-reducers';

function GHGEmissionsProvider({ fetchGHGEmissions, params }) {
  return <LocalizedProvider fetchData={fetchGHGEmissions} params={params} />;
}

GHGEmissionsProvider.propTypes = {
  fetchGHGEmissions: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(GHGEmissionsProvider);
