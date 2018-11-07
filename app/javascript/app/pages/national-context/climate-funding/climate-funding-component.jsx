import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './climate-funding-styles.scss';

class ClimateFunding extends PureComponent {
  render() {
    return <p className={styles.text}>The ClimateFunding section</p>;
  }
}

ClimateFunding.propTypes = {};

ClimateFunding.defaultProps = {};

export default ClimateFunding;
