import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';
import NavNestedMenu from 'components/nav-nested-menu';
import { getTranslation } from 'utils/translations';

import styles from './nav-styles.scss';

const renderActions = () => {
  // return (
  //   <div className={styles.actions}>
  //     Download and about links
  //   </div>
  // );
};

class Nav extends PureComponent {
  render() {
    const { routes, theme, content, provinceInfo, locale } = this.props;
    return (
      <nav className={theme.nav}>
        {routes.map(route => {
          if (route.navNestedMenu) {
            return (
              <NavNestedMenu
                key={route.label}
                title={route.label}
                className={cx(styles.link, theme.link)}
                Child={route.Child}
              />
            );
          }
          if (route.province) {
            const isoCode = provinceInfo && provinceInfo.iso_code3;
            return (
              <NavLink
                exact={route.exact || false}
                className={cx(styles.link, theme.link)}
                key={route.slug}
                to={`/${locale}/regions/${isoCode}/${route.slug}`}
                activeClassName={styles.active}
                onTouchStart={undefined}
                onMouseDown={undefined}
              >
                {getTranslation(content, route.slug, 'title')}
              </NavLink>
            );
          }
          return (
            <NavLink
              exact={route.exact || false}
              className={cx(styles.link, theme.link)}
              key={route.slug}
              to={route.link || route.path}
              activeClassName={styles.active}
              onTouchStart={undefined}
              onMouseDown={undefined}
            >
              {getTranslation(content, route.slug, 'title')}
            </NavLink>
          );
        })}
        {renderActions()}
      </nav>
    );
  }
}

Nav.propTypes = {
  routes: PropTypes.array.isRequired,
  theme: PropTypes.shape({ nav: PropTypes.string, link: PropTypes.string }),
  content: PropTypes.object.isRequired,
  provinceInfo: PropTypes.object,
  locale: PropTypes.string
};

Nav.defaultProps = { theme: {}, provinceInfo: null, locale: '' };

export default Nav;
