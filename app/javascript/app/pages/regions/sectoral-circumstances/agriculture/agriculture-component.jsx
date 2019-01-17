import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import Card from 'components/card';
import BarChart from '../bar-chart';

import styles from '../sectoral-circumstances-styles.scss';

class Agriculture extends PureComponent {
  render() {
    const {
      t,
      harvestedAreaChartData,
      harvestedAreaIndicatorName,
      populationChartData,
      populationIndicatorName
    } = this.props;

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
            <BarChart chartData={harvestedAreaChartData} />
          </Card>
        </div>
        <div className={styles.cardWrapper}>
          <Card header={cardHeader(populationIndicatorName)}>
            <BarChart chartData={populationChartData} />
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
