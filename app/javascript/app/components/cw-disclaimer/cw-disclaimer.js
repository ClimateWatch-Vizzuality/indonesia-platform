import { connect } from 'react-redux';
import { getTranslation } from 'utils/translations';
import Component from './cw-disclaimer-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  const descSlug = 'climate-watch-disclaimer';
  const btnSlug = 'climate-watch-button';
  return {
    description: getTranslation(data, descSlug, 'description'),
    buttonTitle: getTranslation(data, btnSlug, 'title')
  };
};

export default connect(mapStateToProps, null)(Component);
