import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';

import styles from './nav-styles.scss';

class Nav extends PureComponent {
  render() {
    const { routes, theme } = this.props;
    return (
      <nav className={theme.nav}>
        {routes.map(route => (
          <NavLink
            exact={route.exact || false}
            className={cx(styles.link, theme.link)}
            key={route.label}
            to={route.link || route.path}
            activeClassName={styles.active}
            onTouchStart={undefined}
            onMouseDown={undefined}
          >
            {route.label}
          </NavLink>
        ))}
      </nav>
    );
  }
}

Nav.propTypes = {
  routes: PropTypes.array.isRequired,
  theme: PropTypes.shape({ nav: PropTypes.string, link: PropTypes.string })
};

Nav.defaultProps = { theme: {} };

export default Nav;
