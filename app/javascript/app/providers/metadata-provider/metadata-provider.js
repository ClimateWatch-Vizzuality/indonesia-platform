import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as actions from './metadata-provider-actions';
import reducers, { initialState } from './metadata-provider-reducers';

class MetaProvider extends PureComponent {
  componentDidMount() {
    const { fetchMeta, meta } = this.props;
    fetchMeta(meta);
  }

  render() {
    return null;
  }
}

MetaProvider.propTypes = {
  meta: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]).isRequired,
  fetchMeta: PropTypes.func.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(MetaProvider);
