import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './emission-activities-provider-actions';
import reducers, {
  initialState
} from './emission-activities-provider-reducers';

function EmissionActivitiesProvider({ fetchEmissionActivities }) {
  return <LocalizedProvider fetchData={fetchEmissionActivities} />;
}

EmissionActivitiesProvider.propTypes = {
  fetchEmissionActivities: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EmissionActivitiesProvider);
