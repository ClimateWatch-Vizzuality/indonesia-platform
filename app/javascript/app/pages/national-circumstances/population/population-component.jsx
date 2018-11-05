import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './population-styles.scss';

class Nav extends PureComponent {
  render() {
    return (
     <p className={styles.text}>The population section</p>
    );
  }
}

Nav.propTypes = {};

Nav.defaultProps = {};

export default Nav;
