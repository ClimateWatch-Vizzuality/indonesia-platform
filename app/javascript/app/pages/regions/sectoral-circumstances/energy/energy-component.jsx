import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/card';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import BarChart from '../bar-chart';

import styles from '../sectoral-circumstances-styles.scss';

class Energy extends PureComponent {
  render() {
    const { t, chartData, indicatorName } = this.props;

    const cardHeader = (
      <div className={styles.cardHeader}>
        <span>
          {indicatorName}
        </span>
        <InfoDownloadToolbox
          className={{ buttonWrapper: styles.buttonWrapper }}
          slugs="GEOPORTAL"
          downloadUri=""
        />
      </div>
    );

    return (
      <React.Fragment>
        <h2 className={styles.title}>
          {t('pages.regions.sectoral-circumstances.energy.title')}
        </h2>
        <div className={styles.cardWrapper}>
          <Card header={cardHeader}>
            <BarChart chartData={chartData} noFormat />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

Energy.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  indicatorName: PropTypes.string
};

Energy.defaultProps = { chartData: {}, indicatorName: '' };

export default Energy;
