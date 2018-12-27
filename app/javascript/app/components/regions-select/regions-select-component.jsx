import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ResultsList from 'components/results-list';

import styles from 'components/nav-nested-menu/nav-nested-menu-styles';

class RegionsSelect extends PureComponent {
  render() {
    const {
      provinces,
      opened,
      className,
      onItemClick,
      activeProvince
    } = this.props;

    return opened && (
        <React.Fragment>
          <ResultsList
            list={provinces}
            activeProvince={activeProvince}
            className={cx(className, styles.regionsList)}
            emptyDataMsg="No results"
            handleMouseItemEnter={() => {
            }}
            handleMouseItemLeave={() => {
            }}
            handleClick={onItemClick}
          />
        </React.Fragment>
      );
  }
}

RegionsSelect.propTypes = {
  provinces: PropTypes.array,
  opened: PropTypes.bool,
  className: PropTypes.string,
  onItemClick: PropTypes.func,
  activeProvince: PropTypes.string
};

RegionsSelect.defaultProps = {
  provinces: [],
  opened: false,
  className: '',
  onItemClick: () => {
  },
  activeProvince: ''
};

export default RegionsSelect;
