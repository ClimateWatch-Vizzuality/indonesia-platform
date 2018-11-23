import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

class IndicatorsProvider extends PureComponent {
  componentDidMount() {
    const { fetchIndicators } = this.props;
    fetchIndicators();
  }

  render() {
    return null;
  }
}

IndicatorsProvider.propTypes = { fetchIndicators: PropTypes.func.isRequired };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(IndicatorsProvider);
