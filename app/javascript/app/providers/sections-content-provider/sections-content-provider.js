import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import * as actions from './sections-content-provider-actions';
import reducers, { initialState } from './sections-content-provider-reducers';

class SectionsContentProvider extends PureComponent {
  componentDidMount() {
    const { fetchSectionsContent, params } = this.props;
    fetchSectionsContent(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchSectionsContent, params } = this.props;
    const { params: prevParams } = prevProps;
    if (!isEqual(prevParams, params)) fetchSectionsContent(params);
  }

  render() {
    return null;
  }
}

SectionsContentProvider.propTypes = {
  fetchSectionsContent: PropTypes.func.isRequired,
  params: PropTypes.object.isRequired
};

export const reduxModule = { actions, reducers, initialState };
export default connect(null, actions)(SectionsContentProvider);
