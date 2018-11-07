import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './historical-emissions-styles.scss';

class Historical extends PureComponent {
  render() {
    return <p className={styles.text}>The Historical section</p>;
  }
}

Historical.propTypes = {};

Historical.defaultProps = {};

export default Historical;
