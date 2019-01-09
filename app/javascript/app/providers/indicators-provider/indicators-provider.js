import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchIndicators };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
