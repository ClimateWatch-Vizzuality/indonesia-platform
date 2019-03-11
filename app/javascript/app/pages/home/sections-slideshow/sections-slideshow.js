import { connect } from 'react-redux';
import { getLocale } from 'selectors/translation-selectors';
import withTranslations from 'providers/translations-provider/with-translations.hoc';
import Component from './sections-slideshow-component';

const mapStateToProps = state => ({ locale: getLocale(state) });

export default connect(mapStateToProps, null)(withTranslations(Component));
