import React from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';
import cx from 'classnames';

import { Icon } from 'cw-components';

import arrow from 'assets/icons/dropdown-arrow';
import styles from './results-list-styles';

const ResultsList = props => {
  const {
    className,
    list,
    hasIcon,
    emptyDataMsg,
    theme,
    handleMouseItemEnter,
    handleMouseItemLeave,
    handleClick,
    activeProvince
  } = props;
  return (
    <ul className={cx(styles.resultsList, className, theme.resultsList)}>
      {
        list.length > 0 ? list.map(item => (
            <li
              className={cx(styles.listItem, theme.listItem, {
                [styles.active]: activeProvince === item.value
              })}
              onMouseEnter={() => handleMouseItemEnter(item.value)}
              onMouseLeave={handleMouseItemLeave}
              key={item.value}
              id={item.value}
            >
              <NavLink
                exact
                className={cx(styles.link, theme.link)}
                to={item.path}
                onTouchStart={undefined}
                onMouseDown={undefined}
                onClick={() => handleClick(item.value)}
              >
                {item.label}
                {hasIcon && <Icon icon={arrow} className={styles.iconArrow} />}
              </NavLink>
            </li>
          )) : <li className={cx(styles.listItem, theme.listItem)} key="empty">
            <span className={cx(styles.link, theme.link)}>{emptyDataMsg}</span>
          </li>
      }
    </ul>
  );
};

ResultsList.propTypes = {
  list: PropTypes.array,
  hasIcon: PropTypes.bool,
  emptyDataMsg: PropTypes.string,
  className: PropTypes.string,
  theme: PropTypes.object,
  handleMouseItemEnter: PropTypes.func,
  handleMouseItemLeave: PropTypes.func,
  handleClick: PropTypes.func,
  activeProvince: PropTypes.string
};

ResultsList.defaultProps = {
  list: [],
  hasIcon: false,
  emptyDataMsg: 'No data',
  theme: {},
  className: '',
  activeProvince: '',
  handleMouseItemEnter() {
  },
  handleMouseItemLeave() {
  },
  handleClick() {
  }
};

export default ResultsList;
