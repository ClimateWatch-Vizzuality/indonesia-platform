import { connect } from 'react-redux';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import PlanningComponent from './sections-component';

const mapStateToProps = ({ location }) => {
  const route = location.routesMap[location.type];
  const { section: currentSectionSlug } = location.payload;
  let section = null;
  if (route.sections) {
    const defaultSection = route.sections.find(s => s.default);
    section = route.sections.find(s => s.slug === currentSectionSlug) ||
      defaultSection;
  }
  return { route, section };
};

export default connect(mapStateToProps, null)(
  withTranslations(PlanningComponent)
);
