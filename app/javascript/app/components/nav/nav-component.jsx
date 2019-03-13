import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import { NavLink } from 'redux-first-router-link';
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
    const { routes, theme, parent, provinceInfo, t, locale } = this.props;
    return (
      <nav className={theme.nav}>
        {routes.map(route => {
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
                {
                  parent
                    ? t(`pages.${parent.slug}.${route.slug}.title`)
                    : t(`pages.${route.slug}.title`)
                }
              </NavLink>
            );
          }
          return (
            <NavLink
              exact={route.exact || false}
              className={cx(styles.link, theme.link)}
              key={route.slug}
              to={`/${locale}${route.link || route.path}`}
              activeClassName={styles.active}
              onTouchStart={undefined}
              onMouseDown={undefined}
            >
              {
                parent
                  ? t(`pages.${parent.slug}.${route.slug}.title`)
                  : t(`pages.${route.slug}.title`)
              }
            </NavLink>
          );
        })}
        {renderActions()}
      </nav>
    );
  }
}

Nav.propTypes = {
  t: PropTypes.func.isRequired,
  routes: PropTypes.array.isRequired,
  parent: PropTypes.object,
  theme: PropTypes.shape({ nav: PropTypes.string, link: PropTypes.string }),
  provinceInfo: PropTypes.object,
  locale: PropTypes.string
};

Nav.defaultProps = { theme: {}, parent: null, provinceInfo: null, locale: '' };

export default Nav;
