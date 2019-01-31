import React from 'react';
import PropTypes from 'prop-types';

import InfoDownloadToolbox from 'components/info-download-toolbox';

import styles from './card-header-styles.scss';

const CardHeader = ({ title, showInfoButton, infoSlugs, infoDownloadUri }) => (
  <div className={styles.cardHeader}>
    <span>{title}</span>
    {
      showInfoButton &&
        (
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs={infoSlugs}
            downloadUri={infoDownloadUri}
          />
        )
    }
  </div>
);

CardHeader.propTypes = {
  title: PropTypes.string,
  infoSlugs: PropTypes.array,
  infoDownloadUri: PropTypes.string,
  showInfoButton: PropTypes.bool
};

CardHeader.defaultProps = {
  title: '',
  showInfoButton: true,
  infoSlugs: [],
  infoDownloadUri: ''
};

export default CardHeader;
