import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './funding-oportunities-provider-actions';
import reducers, {
  initialState
} from './funding-oportunities-provider-reducers';

class FundingOportunitiesProvider extends PureComponent {
  componentDidMount() {
    const { fetchFundingOportunities, params } = this.props;
    fetchFundingOportunities(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchFundingOportunities, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchFundingOportunities(params);
  }

  render() {
    return null;
  }
}

FundingOportunitiesProvider.propTypes = {
  fetchFundingOportunities: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(FundingOportunitiesProvider);
