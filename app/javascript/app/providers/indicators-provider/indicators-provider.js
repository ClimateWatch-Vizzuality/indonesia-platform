import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './indicators-provider-actions';
import * as reducers from './indicators-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchIndicators };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
