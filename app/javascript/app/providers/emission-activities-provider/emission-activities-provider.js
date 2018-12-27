import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './emission-activities-provider-actions';
import * as reducers from './emission-activities-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchEmissionActivities };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
