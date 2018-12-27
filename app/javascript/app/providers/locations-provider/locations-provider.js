import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './locations-provider-actions';
import * as reducers from './locations-provider-reducers';

const { initialState } = reducers;

class Locations extends PureComponent {
  componentDidMount() {
    const { fetchLocations, params } = this.props;
    fetchLocations(params);
  }

  render() {
    return null;
  }
}

Locations.propTypes = {
  fetchLocations: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(Locations);
