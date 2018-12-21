import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { getProvince } from 'selectors/provinces-selectors';
import isEqual from 'lodash/isEqual';

import * as actions from './climate-plans-provider-actions';
import reducers, { initialState } from './climate-plans-provider-reducers';

class ClimatePlansProvider extends PureComponent {
  componentDidMount() {
    const { fetchClimatePlans, province } = this.props;
    fetchClimatePlans(province);
  }

  componentDidUpdate(prevProps) {
    const { fetchClimatePlans, province } = this.props;
    const { province: prevParams } = prevProps;

    if (!isEqual(prevParams, province)) fetchClimatePlans(province);
  }

  render() {
    return null;
  }
}

ClimatePlansProvider.propTypes = {
  fetchClimatePlans: PropTypes.func.isRequired,
  province: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };

const mapStateToProps = state => ({ province: getProvince(state) });
export default connect(mapStateToProps, actions)(ClimatePlansProvider);
