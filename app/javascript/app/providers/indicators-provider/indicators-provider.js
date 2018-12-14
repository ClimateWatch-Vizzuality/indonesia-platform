import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

class IndicatorsProvider extends PureComponent {
  componentDidMount() {
    const { fetchIndicators, params } = this.props;
    fetchIndicators(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchIndicators, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchIndicators(params);
  }

  render() {
    return null;
  }
}

IndicatorsProvider.propTypes = {
  fetchIndicators: PropTypes.func.isRequired,
  params: PropTypes.object
};

IndicatorsProvider.defaultProps = { params: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(IndicatorsProvider);
