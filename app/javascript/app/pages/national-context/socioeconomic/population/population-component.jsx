import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';

import dropdownStyles from 'styles/dropdown';
import CustomTooltip from './bar-chart-tooltip';
import styles from './population-styles';

class Population extends PureComponent {
  render() {
    const {
      t,
      chartData,
      onLegendChange,
      onIndicatorChange,
      nationalIndicatorsOptions,
      selectedIndicator,
      sources,
      downloadURI
    } = this.props;

    const nationalIndLabel = t(
      'pages.national-context.socioeconomic.labels.national-indicators'
    );
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.national-context.socioeconomic.population.title')}
          description={t(
            'pages.national-context.socioeconomic.population.description'
          )}
        />
        <div className={styles.container}>
          <div>
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={nationalIndLabel}
                  label={nationalIndLabel}
                  placeholder={`Filter by ${nationalIndLabel}`}
                  options={nationalIndicatorsOptions}
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
                    type="bar"
                    config={chartData.config}
                    data={chartData.data}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    getCustomYLabelFormat={chartData.config.yLabelFormat}
                    domain={chartData.domain}
                    dataOptions={chartData.dataOptions}
                    dataSelected={chartData.dataSelected}
                    height={300}
                    barSize={30}
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

Population.propTypes = {
  t: PropTypes.func.isRequired,
  onLegendChange: PropTypes.func.isRequired,
  onIndicatorChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  selectedIndicator: PropTypes.object,
  nationalIndicatorsOptions: PropTypes.array.isRequired,
  sources: PropTypes.array.isRequired,
  downloadURI: PropTypes.string.isRequired
};

Population.defaultProps = { selectedIndicator: {}, chartData: null };

export default Population;
