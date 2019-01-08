import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import ResultsList from 'components/results-list';

import resultsStyles from 'components/results-list/results-list-styles';
import styles from './download-menu-styles';

class DownloadMenu extends PureComponent {
  render() {
    const { className, options, handleDownload, opened } = this.props;

    return opened && (
    <ResultsList
      list={options}
      className={cx(
            className,
            resultsStyles.downloadMenuLink,
            styles.downloadMenu
          )}
      emptyDataMsg="No results"
      opened={opened}
      handleMouseItemEnter={() => {
          }}
      handleMouseItemLeave={() => {
          }}
      handleClick={option => handleDownload(option)}
    />
      );
  }
}

DownloadMenu.propTypes = {
  opened: PropTypes.bool,
  className: PropTypes.string,
  handleDownload: PropTypes.func,
  options: PropTypes.array
};

DownloadMenu.defaultProps = {
  opened: false,
  className: '',
  handleDownload: () => {
  },
  options: []
};

export default DownloadMenu;
