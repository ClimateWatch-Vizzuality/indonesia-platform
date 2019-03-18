import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';

import dropdownStyles from 'styles/dropdown';
import CustomTooltip from '../bar-chart-tooltip';
import styles from '../population/population-styles';

class Economy extends PureComponent {
  render() {
    const {
      t,
      chartData,
      onIndicatorChange,
      onLegendChange,
      indicatorOptions,
      selectedIndicator,
      sources,
      downloadURI
    } = this.props;

    const nationalIndLabel = t(
      'pages.national-context.socioeconomic.labels.national-indicators'
    );
    const provinceIndLabel = t(
      'pages.national-context.socioeconomic.labels.province-indicators'
    );

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.national-context.socioeconomic.economic.title')}
          description={t(
            'pages.national-context.socioeconomic.economic.description'
          )}
        />
        <div className={styles.container}>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={provinceIndLabel}
                  options={indicatorOptions}
                  onValueChange={onIndicatorChange}
                  value={selectedIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs={sources}
                downloadUri={downloadURI}
              />
            </div>
            {
              chartData &&
                (
                  <Chart
                    type="line"
                    dots={false}
                    lineType="linear"
                    config={chartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={chartData.dataOptions}
                    dataSelected={chartData.dataSelected}
                    getCustomYLabelFormat={chartData.config.yLabelFormat}
                    data={chartData.data}
                    domain={chartData.domain}
                    height={300}
                    customMessage={t('common.chart-no-data')}
                    onLegendChange={onLegendChange}
                  />
                )
            }
          </div>
        </div>
      </div>
    );
  }
}

Economy.propTypes = {
  t: PropTypes.func.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  indicatorOptions: PropTypes.array,
  selectedIndicator: PropTypes.object,
  sources: PropTypes.array,
  downloadURI: PropTypes.string
};

Economy.defaultProps = {
  chartData: {},
  indicatorOptions: [],
  selectedIndicator: {},
  sources: [],
  downloadURI: ''
};

export default Economy;
