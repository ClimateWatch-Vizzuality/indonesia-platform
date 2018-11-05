import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './historical-styles.scss';

class Nav extends PureComponent {
  render() {
    return (
     <p className={styles.text}>The historical ghg emissions section</p>
    );
  }
}

Nav.propTypes = {};

Nav.defaultProps = {};

export default Nav;
