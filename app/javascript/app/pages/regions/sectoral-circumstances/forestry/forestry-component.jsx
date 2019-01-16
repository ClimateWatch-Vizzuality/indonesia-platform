import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/card';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { format } from 'd3-format';
import CustomTooltip from '../bar-chart-tooltip';

import styles from '../sectoral-circumstances-styles.scss';

class Forestry extends PureComponent {
  render() {
    const { t, chartData, indicatorName } = this.props;

    const unit = chartData &&
      chartData.config &&
      chartData.config.axes &&
      chartData.config.axes.yLeft &&
      chartData.config.axes.yLeft.unit;

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
          {t('pages.regions.sectoral-circumstances.forestry.title')}
        </h2>
        <div className={styles.cardWrapper}>
          <Card header={cardHeader}>
            {
              chartData &&
                (
                  <Chart
                    type="bar"
                    config={chartData.config}
                    data={chartData.data}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    getCustomYLabelFormat={value =>
                      `${format('~s')(value)} ${unit}`}
                    domain={chartData.domain}
                    dataOptions={chartData.dataOptions}
                    dataSelected={chartData.dataSelected}
                    hideRemoveOptions
                    height={300}
                    barSize={20}
                    barGap={0}
                    customMessage={t('common.chart-no-data')}
                  />
                )
            }
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

Forestry.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  indicatorName: PropTypes.string
};

Forestry.defaultProps = { chartData: {}, indicatorName: '' };

export default Forestry;
