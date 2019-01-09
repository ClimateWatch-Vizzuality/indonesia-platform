import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './ghg-target-emissions-provider-actions';
import reducers, {
  initialState
} from './ghg-target-emissions-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchGHGTargetEmissions };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
