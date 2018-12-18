import { connect } from 'react-redux';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './funding-oportunities-provider-actions';
import reducers, {
  initialState
} from './funding-oportunities-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchFundingOportunities };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, mapDispatchToProps)(LocalizedProvider);
