import React from 'react';
import { Chart, ChartComposed } from 'cw-components';
import { PropTypes } from 'prop-types';
import styles from './chart-styles';

const ChartComponent = props => {
  const { chartType } = props;
  return (
    <div className={styles.chart}>
      {
        chartType === 'composed'
          ? <ChartComposed {...props} />
          : <Chart {...props} />
      }
    </div>
  );
};

ChartComponent.propTypes = { chartType: PropTypes.string };

ChartComponent.defaultProps = { chartType: 'simple' };

export default ChartComponent;
