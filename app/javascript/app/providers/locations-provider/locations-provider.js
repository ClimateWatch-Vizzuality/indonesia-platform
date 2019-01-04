import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './locations-provider-actions';
import reducers, { initialState } from './locations-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchLocations };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
