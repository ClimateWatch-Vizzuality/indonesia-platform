import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './funding-oportunities-provider-actions';
import * as reducers from './funding-oportunities-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchFundingOportunities };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
