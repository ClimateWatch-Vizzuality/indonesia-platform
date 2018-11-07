import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './adaptation-styles.scss';

class Adaptation extends PureComponent {
  render() {
    return <p className={styles.text}>The Adaptation section</p>;
  }
}

Adaptation.propTypes = {};

Adaptation.defaultProps = {};

export default Adaptation;
