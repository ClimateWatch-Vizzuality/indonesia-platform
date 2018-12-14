import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './emission-activities-provider-actions';
import reducers, {
  initialState
} from './emission-activities-provider-reducers';

class EmissionActivities extends PureComponent {
  componentDidMount() {
    const { fetchEmissionActivities, locale } = this.props;
    fetchEmissionActivities({ locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchEmissionActivities, locale } = this.props;
    const { locale: prevLocale } = prevProps;
    if (!isEqual(prevLocale, locale)) fetchEmissionActivities({ locale });
  }

  render() {
    return null;
  }
}

EmissionActivities.propTypes = {
  fetchEmissionActivities: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(EmissionActivities);
