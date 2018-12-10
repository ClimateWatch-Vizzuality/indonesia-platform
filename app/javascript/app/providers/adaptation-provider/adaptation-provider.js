import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './adaptation-provider-actions';
import reducers, { initialState } from './adaptation-provider-reducers';

class Adaptation extends PureComponent {
  componentDidMount() {
    const { fetchAdaptation, params } = this.props;
    fetchAdaptation(params);
  }

  render() {
    return null;
  }
}

Adaptation.propTypes = {
  fetchAdaptation: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(Adaptation);
