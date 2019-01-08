import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { NavLink } from 'redux-first-router-link';
import cx from 'classnames';

import { Icon } from 'cw-components';

import arrow from 'assets/icons/dropdown-arrow';
import styles from './results-list-styles';

class ResultsList extends PureComponent {
  componentWillMount = () => {
    document.addEventListener('mousedown', this.handleClick, false);
  };

  componentWillUnmount = () => {
    document.removeEventListener('mousedown', this.handleClick, false);
  };

  handleClick = e => {
    const { handleClickOutside } = this.props;
    if (this.node.contains(e.target)) {
      return;
    }

    handleClickOutside();
  };

  render() {
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
    } = this.props;

    const renderItem = item =>
      item.path
        ? (
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
)
        : (
          <button
            type="button"
            className={cx(styles.link, theme.link)}
            onClick={() => handleClick(item)}
          >
            {item.label}
          </button>
);

    return (
      <ul
        ref={node => this.node = node}
        className={cx(styles.resultsList, className, theme.resultsList)}
      >
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
              {renderItem(item)}
            </li>
            )) : (
              <li className={cx(styles.listItem, theme.listItem)} key="empty">
                <span className={cx(styles.link, theme.link)}>
                  {emptyDataMsg}
                </span>
              </li>
)
        }
      </ul>
    );
  }
}

ResultsList.propTypes = {
  list: PropTypes.array,
  hasIcon: PropTypes.bool,
  emptyDataMsg: PropTypes.string,
  className: PropTypes.string,
  theme: PropTypes.object,
  handleMouseItemEnter: PropTypes.func,
  handleMouseItemLeave: PropTypes.func,
  handleClick: PropTypes.func,
  handleClickOutside: PropTypes.func,
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
  },
  handleClickOutside() {
  }
};

export default ResultsList;
