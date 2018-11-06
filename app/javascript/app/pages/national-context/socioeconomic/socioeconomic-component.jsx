import React, { PureComponent } from 'react';
// import PropTypes from 'prop-types';
import styles from './socioeconomic-styles.scss';

class Socioeconomic extends PureComponent {
  render() {
    return (
      <p className={styles.text}>The socioeconomic section</p>
    );
  }
}

Socioeconomic.propTypes = {};

Socioeconomic.defaultProps = {};

export default Socioeconomic;
