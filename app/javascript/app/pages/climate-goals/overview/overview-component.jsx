import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './overview-styles.scss';

class Overview extends PureComponent {
  render() {
    return <p className={styles.text}>The overview section</p>;
  }
}

Overview.propTypes = {};

Overview.defaultProps = {};

export default Overview;
