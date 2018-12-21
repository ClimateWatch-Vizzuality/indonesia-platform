import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ResultsList from 'components/results-list';

import styles from 'components/nav-nested-menu/nav-nested-menu-styles';

class RegionsSelect extends PureComponent {
  render() {
    const { provinces, opened, className } = this.props;

    return opened && (
    <React.Fragment>
      <ResultsList
        list={provinces}
        className={cx(className, styles.regionsList)}
        opened
        emptyDataMsg="No results"
        handleMouseItemEnter={() => {
            }}
        handleMouseItemLeave={() => {
            }}
        handleClick={() => {
            }}
      />
    </React.Fragment>
      );
  }
}

RegionsSelect.propTypes = {
  provinces: PropTypes.array,
  opened: PropTypes.bool,
  className: PropTypes.string
};

RegionsSelect.defaultProps = { provinces: [], opened: false, className: '' };

export default RegionsSelect;
