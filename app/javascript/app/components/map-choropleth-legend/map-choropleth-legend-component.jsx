import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './map-choropleth-legend-styles';

class MapChoroplethLegend extends PureComponent {
  render() {
    const { buckets, unit } = this.props;

    if (!buckets.length) return null;

    const displayValue = valueText => (
      <span className={styles.valueText}>
        {valueText} {unit}
      </span>
    );

    return (
      <div className={styles.container}>
        {displayValue(`<${buckets[0].maxValue}`)}
        <div className={styles.buckets}>
          {buckets.map(bucket => (
            <span
              className={styles.bucket}
              style={{ backgroundColor: bucket.color }}
              key={bucket.color}
            />
          ))}
        </div>
        {displayValue(`>${buckets[buckets.length - 1].minValue}`)}
      </div>
    );
  }
}

MapChoroplethLegend.propTypes = {
  unit: PropTypes.string,
  buckets: PropTypes.arrayOf(
    PropTypes.shape({
      minValue: PropTypes.number,
      maxValue: PropTypes.number,
      color: PropTypes.string
    })
  ).isRequired
};

MapChoroplethLegend.defaultProps = { unit: '' };

export default MapChoroplethLegend;
