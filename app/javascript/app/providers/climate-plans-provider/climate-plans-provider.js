import { connect } from 'react-redux';
import { getProvince } from 'selectors/provinces-selectors';

import LocalizedProvider from 'providers/localized-provider';
import * as actions from './climate-plans-provider-actions';
import * as reducers from './climate-plans-provider-reducers';

const { initialState } = reducers;

const mapDispatchToProps = { fetchData: actions.fetchClimatePlans };
const mapStateToProps = state => ({ params: { location: getProvince(state) } });

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, mapDispatchToProps)(LocalizedProvider);
