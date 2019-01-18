import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './timeline-provider-actions';
import reducers, { initialState } from './timeline-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchTimeline };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
