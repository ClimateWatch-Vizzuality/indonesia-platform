import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from 'components/card';
import CardHeader from '../card-header';
import BarChart from '../bar-chart';

import styles from './agriculture-styles.scss';

class Agriculture extends PureComponent {
  render() {
    const {
      t,
      harvestedAreaChartData,
      harvestedAreaIndicatorName,
      harvestedAreaSources,
      populationChartData,
      populationIndicatorName,
      populationSources
    } = this.props;

    return (
      <React.Fragment>
        <h2 className={styles.title}>
          {t('pages.regions.sectoral-circumstances.agriculture.title')}
        </h2>
        <div className={styles.cardWrapper}>
          <Card
            header={
              (
                <CardHeader
                  title={harvestedAreaIndicatorName}
                  infoSlugs={harvestedAreaSources}
                />
              )
            }
          >
            <BarChart chartData={harvestedAreaChartData} />
          </Card>
        </div>
        <div className={styles.cardWrapper}>
          <Card
            header={
              (
                <CardHeader
                  title={populationIndicatorName}
                  infoSlugs={populationSources}
                />
              )
            }
          >
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
  harvestedAreaSources: PropTypes.array,
  populationChartData: PropTypes.object,
  populationIndicatorName: PropTypes.string,
  populationSources: PropTypes.array
};

Agriculture.defaultProps = {
  harvestedAreaChartData: {},
  harvestedAreaIndicatorName: '',
  harvestedAreaSources: [],
  populationChartData: {},
  populationIndicatorName: '',
  populationSources: []
};

export default Agriculture;
