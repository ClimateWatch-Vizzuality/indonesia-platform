import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ghg-target-emissions-provider-actions';
import reducers, {
  initialState
} from './ghg-target-emissions-provider-reducers';

function GHGEmissionTargetsProvider({ fetchGHGTargetEmissions }) {
  return <LocalizedProvider fetchData={fetchGHGTargetEmissions} />;
}

GHGEmissionTargetsProvider.propTypes = {
  fetchGHGTargetEmissions: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(GHGEmissionTargetsProvider);
