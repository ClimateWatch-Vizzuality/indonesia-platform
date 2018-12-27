import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './sections-content-provider-actions';
import * as reducers from './sections-content-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchSectionsContent };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
