import { connect } from 'react-redux';
import withTranslations from 'providers/translations-provider/with-translations.hoc';
import Component from './climate-plans-component';
import { getClimatePlans } from './climate-plans-selectors';

const mapStateToProps = getClimatePlans;

export default connect(mapStateToProps, null)(withTranslations(Component));
