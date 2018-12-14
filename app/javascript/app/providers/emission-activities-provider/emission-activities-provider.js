import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './emission-activities-provider-actions';
import reducers, {
  initialState
} from './emission-activities-provider-reducers';

class EmissionActivities extends PureComponent {
  componentDidMount() {
    const { fetchEmissionActivities, params } = this.props;
    fetchEmissionActivities(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchEmissionActivities, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchEmissionActivities(params);
  }

  render() {
    return null;
  }
}

EmissionActivities.propTypes = {
  fetchEmissionActivities: PropTypes.func.isRequired,
  params: PropTypes.object
};

EmissionActivities.defaultProps = { params: {} };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(EmissionActivities);
