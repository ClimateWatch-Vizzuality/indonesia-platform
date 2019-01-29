import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';

import styles from './tab-styles.scss';

class Tab extends PureComponent {
  // eslint-disable-line react/prefer-stateless-function
  render() {
    const {
      options,
      selectedIndex,
      handleTabIndexChange,
      classNames
    } = this.props;
    return (
      <div className={cx(styles.tab, classNames)}>
        {options.map((option, i) => (
          <button
            key={option}
            className={cx([
              styles.link,
              { [styles.linkActive]: selectedIndex === i }
            ])}
            onClick={() => handleTabIndexChange(i)}
            role="menuitem"
            type="button"
            tabIndex={-1}
          >
            {option}
          </button>
        ))}
      </div>
    );
  }
}

Tab.propTypes = {
  options: PropTypes.array.isRequired,
  selectedIndex: PropTypes.number.isRequired,
  handleTabIndexChange: PropTypes.func.isRequired,
  classNames: PropTypes.string
};

Tab.defaultProps = { classNames: '' };

export default Tab;
