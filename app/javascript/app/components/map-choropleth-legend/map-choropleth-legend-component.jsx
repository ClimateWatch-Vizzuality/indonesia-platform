import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import styles from './map-choropleth-legend-styles';

class MapChoroplethLegend extends PureComponent {
  render() {
    const { buckets } = this.props;

    return (
      <div className={styles.container}>
        <div>
          {buckets.map(value => (
            <span
              className={styles.bucket}
              style={{ backgroundColor: value }}
              key={value}
            />
          ))}
        </div>
      </div>
    );
  }
}

MapChoroplethLegend.propTypes = { buckets: PropTypes.array.isRequired };

export default MapChoroplethLegend;
