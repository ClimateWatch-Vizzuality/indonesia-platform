import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import Nav from 'components/nav';
import { NavLink } from 'redux-first-router-link';
import styles from './header-styles.scss';

class Header extends PureComponent {
  render() {
    const { routes, className } = this.props;
    return (
      <div className={styles.headerContainer} id="header">
        <div className={cx(styles.header, className)}>
          <NavLink
            exact
            className={cx(styles.logo)}
            to="/"
            onTouchStart={undefined}
            onMouseDown={undefined}
          >
            <div className={styles.country}>
              PROJECT
            </div>
            <div className={styles.climateExplorer}>
              <span className={styles.bold}>CLIMATE</span>
              EXPLORER
            </div>
          </NavLink>
          <div className={styles.tabsContainer}>
            <Nav
              theme={{
                nav: cx(styles.stickyNavElement, styles.stickyTabs),
                link: styles.stickyLink
              }}
              routes={routes}
            />
          </div>
        </div>
      </div>
    );
  }
}

Header.propTypes = {
  className: PropTypes.string,
  routes: PropTypes.array.isRequired
};

Header.defaultProps = { className: '' };

export default Header;
