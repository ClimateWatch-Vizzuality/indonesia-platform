import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ghg-emissions-provider-actions';
import * as reducers from './ghg-emissions-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchGHGEmissions };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
