import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import cx from 'classnames';
import styles from './section-title-styles.scss';

class SectionTitle extends PureComponent {
  render() {
    const { theme, title, isSubtitle, className } = this.props;
    return (
      <h2
        className={cx(
          styles.sectionTitle,
          { [styles.sectionSubtitle]: isSubtitle },
          theme.sectionTitle,
          className
        )}
      >
        {title}
      </h2>
    );
  }
}

SectionTitle.propTypes = {
  theme: PropTypes.shape({ sectionTitle: PropTypes.string }),
  title: PropTypes.string,
  className: PropTypes.string,
  isSubtitle: PropTypes.bool
};

SectionTitle.defaultProps = {
  theme: {},
  title: '',
  isSubtitle: false,
  className: null
};
export default SectionTitle;
