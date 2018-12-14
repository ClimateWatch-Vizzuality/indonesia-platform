import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './sections-content-provider-actions';
import reducers, { initialState } from './sections-content-provider-reducers';

class SectionsContentProvider extends PureComponent {
  componentDidMount() {
    const { fetchSectionsContent, locale } = this.props;
    fetchSectionsContent({ locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchSectionsContent, locale } = this.props;
    const { locale: prevLocale } = prevProps;
    if (!isEqual(prevLocale, locale)) fetchSectionsContent({ locale });
  }

  render() {
    return null;
  }
}

SectionsContentProvider.propTypes = {
  fetchSectionsContent: PropTypes.func.isRequired,
  locale: PropTypes.string.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(SectionsContentProvider);
