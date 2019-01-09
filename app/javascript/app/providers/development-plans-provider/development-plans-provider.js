import { connect } from 'react-redux';
import { getProvince } from 'selectors/provinces-selectors';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './development-plans-provider-actions';
import reducers, { initialState } from './development-plans-provider-reducers';

const mapDispatchToProps = { fetchData: actions.fetchDevelopmentPlans };
const mapStateToProps = state => ({ params: { location: getProvince(state) } });

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, mapDispatchToProps)(LocalizedProvider);
