import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './funding-oportunities-provider-actions';
import reducers, {
  initialState
} from './funding-oportunities-provider-reducers';

function FundingOportunitiesProvider({ fetchFundingOportunities }) {
  return <LocalizedProvider fetchData={fetchFundingOportunities} />;
}

FundingOportunitiesProvider.propTypes = {
  fetchFundingOportunities: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(FundingOportunitiesProvider);
