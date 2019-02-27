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
      handleClickOutside,
      activeProvince,
      parentRef
    } = this.props;

    return opened && (
    <React.Fragment>
      <ResultsList
        list={provinces}
        handleClickOutside={handleClickOutside}
        opened={opened}
        parentRef={parentRef}
        activeProvince={activeProvince}
        className={cx(className, styles.regionsList)}
        emptyDataMsg="No results"
        handleMouseItemEnter={undefined}
        handleMouseItemLeave={undefined}
      />
    </React.Fragment>
      );
  }
}

RegionsSelect.propTypes = {
  provinces: PropTypes.array,
  opened: PropTypes.bool,
  className: PropTypes.string,
  handleClickOutside: PropTypes.func,
  activeProvince: PropTypes.string,
  parentRef: PropTypes.instanceOf(Element)
};

RegionsSelect.defaultProps = {
  provinces: [],
  opened: false,
  className: '',
  handleClickOutside: () => {
  },
  activeProvince: '',
  parentRef: null
};

export default RegionsSelect;
