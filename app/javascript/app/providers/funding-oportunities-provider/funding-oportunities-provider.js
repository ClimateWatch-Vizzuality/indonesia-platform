import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './funding-oportunities-provider-actions';
import reducers, {
  initialState
} from './funding-oportunities-provider-reducers';

class FundingOportunitiesProvider extends PureComponent {
  componentDidMount() {
    const { fetchFundingOportunities, locale } = this.props;
    fetchFundingOportunities({ locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchFundingOportunities, locale } = this.props;
    const { locale: prevLocale } = prevProps;
    if (!isEqual(prevLocale, locale)) fetchFundingOportunities({ locale });
  }

  render() {
    return null;
  }
}

FundingOportunitiesProvider.propTypes = {
  fetchFundingOportunities: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(FundingOportunitiesProvider);
