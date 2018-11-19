import { connect } from 'react-redux';
import Component from './province-component';

const mapStateToProps = ({ SectionsContent }) => {
  const { data } = SectionsContent;
  return {
    title: data && data.province && data.province.title,
    description: data && data.province && data.province.description
  };
};

export default connect(mapStateToProps, null)(Component);
