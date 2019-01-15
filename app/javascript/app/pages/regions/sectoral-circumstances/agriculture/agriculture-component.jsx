import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/card';
import Chart from 'components/chart';
import { format } from 'd3-format';
import isEmpty from 'lodash/isEmpty';
import CustomTooltip from '../bar-chart-tooltip';

import styles from './agriculture-styles.scss';

class Agriculture extends PureComponent {
  render() {
    const {
      t,
      harvestedAreaChartData,
      harvestedAreaIndicatorName,
      populationChartData,
      populationIndicatorName
    } = this.props;

    const harvestedAreaUnit = harvestedAreaChartData &&
      harvestedAreaChartData.config &&
      harvestedAreaChartData.config.axes &&
      harvestedAreaChartData.config.axes.yLeft &&
      harvestedAreaChartData.config.axes.yLeft.unit;

    const populationUnit = populationChartData &&
      populationChartData.config &&
      populationChartData.config.axes &&
      populationChartData.config.axes.yLeft &&
      populationChartData.config.axes.yLeft.unit;

    const cardHeader = indicatorName => (
      <div className={styles.cardHeader}>
        <span>
          {indicatorName}
        </span>
      </div>
    );

    return (
      <React.Fragment>
        <h2 className={styles.title}>
          {t('pages.regions.sectoral-circumstances.agriculture.title')}
        </h2>
        <div className={styles.cardWrapper}>
          <Card header={cardHeader(harvestedAreaIndicatorName)}>
            {
              harvestedAreaChartData &&
                !isEmpty(harvestedAreaChartData) &&
                (
                  <Chart
                    type="bar"
                    config={harvestedAreaChartData.config}
                    data={harvestedAreaChartData.data}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    getCustomYLabelFormat={value =>
                      `${format('~s')(value)} ${harvestedAreaUnit}`}
                    domain={harvestedAreaChartData.domain}
                    dataOptions={harvestedAreaChartData.dataOptions}
                    dataSelected={harvestedAreaChartData.dataSelected}
                    hideRemoveOptions
                    height={300}
                    barSize={50}
                    barGap={0}
                    customMessage={t('common.chart-no-data')}
                  />
                )
            }
          </Card>
        </div>
        <div className={styles.cardWrapper}>
          <Card header={cardHeader(populationIndicatorName)}>
            {
              populationChartData &&
                !isEmpty(populationChartData) &&
                (
                  <Chart
                    type="bar"
                    config={populationChartData.config}
                    data={populationChartData.data}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    getCustomYLabelFormat={value =>
                      `${format('~s')(value)} ${populationUnit}`}
                    domain={populationChartData.domain}
                    dataOptions={populationChartData.dataOptions}
                    dataSelected={populationChartData.dataSelected}
                    hideRemoveOptions
                    height={300}
                    barSize={50}
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

Agriculture.propTypes = {
  t: PropTypes.func.isRequired,
  harvestedAreaChartData: PropTypes.object,
  harvestedAreaIndicatorName: PropTypes.string,
  populationChartData: PropTypes.object,
  populationIndicatorName: PropTypes.string
};

Agriculture.defaultProps = {
  harvestedAreaChartData: {},
  harvestedAreaIndicatorName: '',
  populationChartData: {},
  populationIndicatorName: ''
};

export default Agriculture;
