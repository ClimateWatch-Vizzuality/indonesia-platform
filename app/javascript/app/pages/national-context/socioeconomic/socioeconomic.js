import { connect } from 'react-redux';

import { getLocale } from 'selectors/translation-selectors';
import Component from './socioeconomic-component';

const mapStateToProps = state => ({ locale: getLocale(state) });

export default connect(mapStateToProps, null)(Component);
