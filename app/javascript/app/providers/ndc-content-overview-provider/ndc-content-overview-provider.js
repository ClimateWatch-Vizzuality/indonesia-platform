import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ndc-content-overview-provider-actions';
import reducers, {
  initialState
} from './ndc-content-overview-provider-reducers';

const mapDispatchToProps = { fetchData: actions.getNdcContentOverview };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
