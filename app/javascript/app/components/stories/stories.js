import { connect } from 'react-redux';
import Component from './stories-component';

const stories = [
  { link: 'bla', background_image_url: 'assets/province-image.png' },
  { link: 'ble', background_image_url: 'assets/province-image.png' },
  { link: 'bli', background_image_url: 'assets/province-image.png' }
];

const mapStateToProps = () => ({ stories });

export default connect(mapStateToProps, null)(Component);
