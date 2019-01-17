import { getTranslate } from 'selectors/translation-selectors';
import { connect } from 'react-redux';
import Component from './bar-chart-component';

const mapStateToProps = state => ({ t: getTranslate(state) });

export default connect(mapStateToProps, null)(Component);
