import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './indicators-provider-actions';
import reducers, { initialState } from './indicators-provider-reducers';

class IndicatorsProvider extends PureComponent {
  componentDidMount() {
    const { fetchIndicators, locale } = this.props;
    fetchIndicators({ locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchIndicators, locale } = this.props;
    const { locale: prevLocale } = prevProps;
    if (!isEqual(prevLocale, locale)) fetchIndicators({ locale });
  }

  render() {
    return null;
  }
}

IndicatorsProvider.propTypes = {
  fetchIndicators: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(IndicatorsProvider);
