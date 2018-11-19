import { connect } from 'react-redux';

import HomeComponent from './home-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  return { introText: data && data.intro && data.intro.description };
};

export default connect(mapStateToProps, null)(HomeComponent);
