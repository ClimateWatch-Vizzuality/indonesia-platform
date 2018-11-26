import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import styles from './bar-chart-tooltip-styles.scss';

class CustomTooltip extends PureComponent {
  render() {
    const { content, config } = this.props;
    const hasContent = content && content.payload && content.payload.length > 0;
    const payload = content &&
      content.payload &&
      content.payload[0] &&
      content.payload[0].payload;
    const tooltipConfig = config && config.tooltip;
    const yValueFormatFunction = tooltipConfig && tooltipConfig.y.format;
    return (
      <div className={styles.tooltip}>
        {
          hasContent ? (
            <div>
              <div className={styles.tooltipHeader}>
                <span className={styles.title}>
                  {payload.x} {tooltipConfig.indicator}
                </span>
              </div>
              <div className={styles.content}>
                <span>{tooltipConfig.y.label}</span>
                {' '}
                <span>
                  {
                    yValueFormatFunction
                      ? yValueFormatFunction(payload.y)
                      : tooltipConfig.y.format
                  }
                </span>
              </div>
            </div>
) : <div>No data</div>
        }
      </div>
    );
  }
}

CustomTooltip.propTypes = {
  content: Proptypes.object,
  config: Proptypes.object
};
CustomTooltip.defaultProps = { content: {}, config: {} };

export default CustomTooltip;
