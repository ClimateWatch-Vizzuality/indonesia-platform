import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

function IndicatorsProvider({ fetchIndicators }) {
  return <LocalizedProvider fetchData={fetchIndicators} />;
}

IndicatorsProvider.propTypes = { fetchIndicators: PropTypes.func.isRequired };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(IndicatorsProvider);
