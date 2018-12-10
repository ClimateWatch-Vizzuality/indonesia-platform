import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './ghg-target-emissions-provider-actions';
import reducers, {
  initialState
} from './ghg-target-emissions-provider-reducers';

class GHGEmissionTargetsProvider extends PureComponent {
  componentDidMount() {
    const { fetchGHGTargetEmissions, params } = this.props;
    fetchGHGTargetEmissions(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchGHGTargetEmissions, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchGHGTargetEmissions(params);
  }

  render() {
    return null;
  }
}

GHGEmissionTargetsProvider.propTypes = {
  fetchGHGTargetEmissions: PropTypes.func.isRequired,
  params: PropTypes.object
};

GHGEmissionTargetsProvider.defaultProps = { params: null };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(GHGEmissionTargetsProvider);
