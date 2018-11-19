import { connect } from 'react-redux';
import Component from './cw-disclaimer-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  return {
    description: data &&
      data['climate-watch-disclaimer'] &&
      data['climate-watch-disclaimer'].description,
    buttonTitle: data &&
      data['climate-watch-button'] &&
      data['climate-watch-button'].title
  };
};

export default connect(mapStateToProps, null)(Component);
