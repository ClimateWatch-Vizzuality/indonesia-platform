import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ghg-emissions-provider-actions';
import reducers, { initialState } from './ghg-emissions-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchGHGEmissions };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
