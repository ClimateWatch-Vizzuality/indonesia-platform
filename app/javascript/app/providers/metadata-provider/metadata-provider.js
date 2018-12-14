import { PureComponent } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import { getLocale } from 'selectors/translation-selectors';
import * as actions from './metadata-provider-actions';
import reducers, { initialState } from './metadata-provider-reducers';

class MetaProvider extends PureComponent {
  componentDidMount() {
    const { fetchMeta, meta, locale } = this.props;
    fetchMeta({ meta, locale });
  }

  componentDidUpdate(prevProps) {
    const { fetchMeta, meta, locale } = this.props;
    const { locale: prevLocale } = prevProps;
    if (!isEqual(prevLocale, locale)) fetchMeta({ meta, locale });
  }

  render() {
    return null;
  }
}

MetaProvider.propTypes = {
  meta: PropTypes.oneOfType([ PropTypes.string, PropTypes.array ]).isRequired,
  locale: PropTypes.string.isRequired,
  fetchMeta: PropTypes.func.isRequired
};

const mapStateToProps = state => ({ locale: getLocale(state) });
export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(MetaProvider);
