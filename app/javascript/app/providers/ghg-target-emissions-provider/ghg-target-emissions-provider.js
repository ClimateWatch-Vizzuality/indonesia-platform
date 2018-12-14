import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './ghg-target-emissions-provider-actions';
import reducers, {
  initialState
} from './ghg-target-emissions-provider-reducers';

class GHGEmissionTargetsProvider extends PureComponent {
  componentDidMount() {
    const { fetchGHGTargetEmissions, params, locale } = this.props;
    fetchGHGTargetEmissions({ ...params, locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchGHGTargetEmissions, params, locale } = this.props;
    if (!isEqual(this.props, prevProps))
      fetchGHGTargetEmissions({ ...params, locale });
  }

  render() {
    return null;
  }
}

GHGEmissionTargetsProvider.propTypes = {
  fetchGHGTargetEmissions: PropTypes.func.isRequired,
  params: PropTypes.object,
  locale: PropTypes.string.isRequired
};

GHGEmissionTargetsProvider.defaultProps = { params: null };

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(GHGEmissionTargetsProvider);
