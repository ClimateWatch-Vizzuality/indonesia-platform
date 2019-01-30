import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Card from 'components/card';
import CardHeader from '../card-header';
import BarChart from '../bar-chart';

import styles from './forestry-styles.scss';

class Forestry extends PureComponent {
  render() {
    const { t, chartData, indicatorName, sources } = this.props;

    return (
      <React.Fragment>
        <h2 className={styles.title}>
          {t('pages.regions.sectoral-circumstances.forestry.title')}
        </h2>
        <div className={styles.cardWrapper}>
          <Card
            header={<CardHeader title={indicatorName} infoSlugs={sources} />}
          >
            <BarChart chartData={chartData} />
          </Card>
        </div>
      </React.Fragment>
    );
  }
}

Forestry.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  indicatorName: PropTypes.string,
  sources: PropTypes.array
};

Forestry.defaultProps = { chartData: {}, indicatorName: '', sources: [] };

export default Forestry;
