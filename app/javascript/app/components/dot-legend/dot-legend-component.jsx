import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import styles from './dot-legend-styles.scss';

class DotLegend extends PureComponent {
  render() {
    const { legend } = this.props;
    return (
      <div className={styles.legendContainer}>
        {legend.map(item => (
          <div className={styles.item} key={item.name}>
            <span
              className={styles.dot}
              style={{ backgroundColor: item.color }}
            />
            <span className={styles.name}>{item.name}</span>
          </div>
        ))}
      </div>
    );
  }
}

DotLegend.propTypes = { legend: PropTypes.array.isRequired };

DotLegend.defaultProps = {};

export default DotLegend;
