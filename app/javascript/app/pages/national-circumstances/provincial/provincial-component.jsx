import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './provincial-styles.scss';

class Nav extends PureComponent {
  render() {
    return (
     <p className={styles.text}>The provincial section</p>
    );
  }
}

Nav.propTypes = {};

Nav.defaultProps = {};

export default Nav;
