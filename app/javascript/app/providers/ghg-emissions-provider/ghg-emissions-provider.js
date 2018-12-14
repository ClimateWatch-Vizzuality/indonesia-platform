import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './ghg-emissions-provider-actions';
import reducers, { initialState } from './ghg-emissions-provider-reducers';

class GHGEmissionsProvider extends PureComponent {
  componentDidMount() {
    const { fetchGHGEmissions, params, locale } = this.props;
    fetchGHGEmissions({ ...params, locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchGHGEmissions, params, locale } = this.props;
    if (!isEqual(prevProps, this.props))
      fetchGHGEmissions({ ...params, locale });
  }

  render() {
    return null;
  }
}

GHGEmissionsProvider.propTypes = {
  fetchGHGEmissions: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired,
  params: PropTypes.object.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(GHGEmissionsProvider);
