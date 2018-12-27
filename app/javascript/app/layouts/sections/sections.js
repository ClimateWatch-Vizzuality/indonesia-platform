import { connect } from 'react-redux';
import { provincesDetails } from 'selectors/provinces-selectors';

import withTranslations from 'providers/translations-provider/with-translations.hoc';
import PlanningComponent from './sections-component';

const mapStateToProps = state => {
  const { location } = state;
  const route = location.routesMap[location.type];
  const { section: currentSectionSlug } = location.payload;
  let section = null;
  if (route.sections) {
    const defaultSection = route.sections.find(s => s.default);
    section = route.sections.find(s => s.slug === currentSectionSlug) ||
      defaultSection;
  }

  return {
    route,
    section,
    provinceInfo: provincesDetails(state) &&
      provincesDetails(state).provinceInfo
  };
};

export default connect(mapStateToProps, null)(
  withTranslations(PlanningComponent)
);
