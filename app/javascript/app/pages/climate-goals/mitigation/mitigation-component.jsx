import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './mitigation-styles.scss';

class Mitigation extends PureComponent {
  render() {
    return <p className={styles.text}>The Mitigation section</p>;
  }
}

Mitigation.propTypes = {};

Mitigation.defaultProps = {};

export default Mitigation;
