import { connect } from 'react-redux';
import pickBy from 'lodash/pickBy';
import Component from './sections-slideshow-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  const slides = data && pickBy(data, (v, k) => k.includes('slide-'));
  return { slides };
};

export default connect(mapStateToProps, null)(Component);
