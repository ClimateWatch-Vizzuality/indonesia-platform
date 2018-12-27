import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './world-bank-provider-actions';
import * as reducers from './world-bank-provider-reducers';

const { initialState } = reducers;

const { COUNTRY_ISO } = process.env;

class WorldBankProvider extends PureComponent {
  componentDidMount() {
    const { fetchWorldBank, iso } = this.props;
    fetchWorldBank({ iso });
  }

  render() {
    return null;
  }
}

WorldBankProvider.propTypes = {
  fetchWorldBank: PropTypes.func.isRequired,
  iso: PropTypes.string
};

WorldBankProvider.defaultProps = { iso: COUNTRY_ISO };

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(WorldBankProvider);
