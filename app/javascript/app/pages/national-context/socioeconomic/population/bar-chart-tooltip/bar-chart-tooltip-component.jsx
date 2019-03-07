import React, { PureComponent } from 'react';
import Proptypes from 'prop-types';
import get from 'lodash/get';
import styles from './bar-chart-tooltip-styles.scss';

const renderValue = ({ formatFunction }, value) => {
  if (!value) return 'n/a';
  if (formatFunction) return formatFunction(value);
  return value;
};

class CustomTooltip extends PureComponent {
  render() {
    const { content, config } = this.props;
    const hasContent = content && content.payload && content.payload.length > 0;
    const payload = get(content, 'payload[0].payload');
    const tooltipConfig = config && config.tooltip;
    const yKeys = payload && Object
        .keys(payload)
        .filter(k => k !== 'x')
        .sort((a, b) => payload[b] - payload[a]);
    return (
      <div className={styles.tooltip}>
        {
          hasContent ? (
            <div>
              <div className={styles.tooltipHeader}>
                <span>
                  {payload.x}
                </span>
                <span>
                  {tooltipConfig.indicator}
                </span>
              </div>
              <div className={styles.content}>
                {
                  yKeys && yKeys.map(k => (
                    <div className={styles.yDataContainer}>
                      {
                          tooltipConfig.theme &&
                            (
                              <span
                                style={{
                                  backgroundColor: tooltipConfig.theme[k].fill
                                }}
                                className={styles.dot}
                              />
                            )
                        }
                      <span className={styles.yLabel}>
                        {tooltipConfig[k].label}
                      </span>
                      <span className={styles.value}>
                        {renderValue(tooltipConfig, payload[k])}
                      </span>
                    </div>
                    ))
                }
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
