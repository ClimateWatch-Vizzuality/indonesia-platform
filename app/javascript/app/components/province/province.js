import { connect } from 'react-redux';
import { getTranslation } from 'utils/translations';
import Component from './province-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  const slug = 'province';
  return {
    title: getTranslation(data, slug, 'title'),
    description: getTranslation(data, slug, 'description')
  };
};

export default connect(mapStateToProps, null)(Component);
