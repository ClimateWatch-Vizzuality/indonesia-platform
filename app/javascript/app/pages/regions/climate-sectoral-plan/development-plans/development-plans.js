import { connect } from 'react-redux';
import withTranslations from 'providers/translations-provider/with-translations.hoc';
import Component from './development-plans-component';
import { getDevelopmentPlans } from './development-plans-selectors';

const mapStateToProps = getDevelopmentPlans;

export default connect(mapStateToProps, null)(withTranslations(Component));
