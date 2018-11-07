import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './sectoral-information-styles.scss';

class Sectoral extends PureComponent {
  render() {
    return <p className={styles.text}>The Sectoral section</p>;
  }
}

Sectoral.propTypes = {};

Sectoral.defaultProps = {};

export default Sectoral;
