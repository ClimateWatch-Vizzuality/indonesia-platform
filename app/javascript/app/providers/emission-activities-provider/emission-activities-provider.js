import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './emission-activities-provider-actions';
import reducers, {
  initialState
} from './emission-activities-provider-reducers';

class EmissionActivities extends PureComponent {
  componentDidMount() {
    const { fetchEmissionActivities } = this.props;
    fetchEmissionActivities();
  }

  render() {
    return null;
  }
}

EmissionActivities.propTypes = {
  fetchEmissionActivities: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EmissionActivities);
