import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';

import dropdownStyles from 'styles/dropdown.scss';
import CustomTooltip from './bar-chart-tooltip';
import styles from './population-styles.scss';

class Population extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: selected.value });
  };

  render() {
    const {
      translations,
      chartData,
      popProvinceChartData,
      nationalIndicatorsOptions,
      popProvincesOptions,
      selectedOptions
    } = this.props;
    return (
      <div className={styles.page}>
        <SectionTitle
          title={translations.title}
          description={translations.description}
        />
        <div className={styles.container}>
          <div className="first-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={translations.nationalIndLabel}
                  label={translations.nationalIndLabel}
                  placeholder={`Filter by ${translations.nationalIndLabel}`}
                  options={nationalIndicatorsOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('popNationalIndicator', selected)}
                  value={selectedOptions.popNationalIndicator}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs=""
                downloadUri=""
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
                    customMessage="No data"
                  />
                )
            }
          </div>
          <div className="second-column">
            <div className={styles.toolbox}>
              <div className={styles.dropdown}>
                <Dropdown
                  key={translations.provinceIndLabel}
                  label={translations.provinceIndLabel}
                  placeholder={`Filter by ${translations.provinceIndLabel}`}
                  options={popProvincesOptions}
                  onValueChange={selected =>
                    this.handleFilterChange('popProvince', selected)}
                  value={selectedOptions.popProvince}
                  theme={{ select: dropdownStyles.select }}
                  hideResetButton
                />
              </div>
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs=""
                downloadUri=""
              />
            </div>
            {
              popProvinceChartData &&
                (
                  <Chart
                    type="bar"
                    config={popProvinceChartData.config}
                    theme={{ legend: styles.legend }}
                    customTooltip={<CustomTooltip />}
                    dataOptions={popProvinceChartData.dataOptions}
                    dataSelected={popProvinceChartData.dataSelected}
                    getCustomYLabelFormat={
                      popProvinceChartData.config.yLabelFormat
                    }
                    data={popProvinceChartData.data}
                    domain={popProvinceChartData.domain}
                    height={300}
                    barSize={30}
                    customMessage="No data"
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
  translations: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    nationalIndLabel: PropTypes.string,
    provinceIndLabel: PropTypes.string
  }).isRequired,
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object.isRequired,
  popProvinceChartData: PropTypes.object.isRequired,
  nationalIndicatorsOptions: PropTypes.array.isRequired,
  popProvincesOptions: PropTypes.array.isRequired,
  selectedOptions: PropTypes.object.isRequired
};

Population.defaultProps = {};

export default Population;
