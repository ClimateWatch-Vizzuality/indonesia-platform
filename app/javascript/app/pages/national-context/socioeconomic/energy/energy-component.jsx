import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Chart from 'components/chart';
import { Dropdown } from 'cw-components';
import isArray from 'lodash/isArray';

import dropdownStyles from 'styles/dropdown.scss';
import styles from './energy-styles.scss';

class Energy extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    let values;
    if (isArray(selected)) {
      values = selected.map(v => v.value).join(',');
    } else {
      values = selected.value;
    }
    onFilterChange({ [filter]: values });
  };

  render() {
    const { translations, chartData, selectedOptions, options } = this.props;

    return (
      <div className={styles.page}>
        <SectionTitle
          title={translations.title}
          description={translations.description}
        />
        <div className={styles.container}>
          <div className={styles.toolbox}>
            <div className={styles.dropdown}>
              <Dropdown
                key={translations.indicatorsLabel}
                label={translations.indicatorsLabel}
                placeholder={`Filter by ${translations.indicatorsLabel}`}
                options={options}
                onValueChange={selected =>
                  this.handleFilterChange('energyInd', selected)}
                value={selectedOptions.energyInd}
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
              chartData.data &&
              (
                <Chart
                  type="line"
                  config={chartData.config}
                  theme={{ legend: styles.legend }}
                  data={chartData.data}
                  dots={false}
                  domain={chartData.domain}
                  getCustomYLabelFormat={chartData.config.yLabelFormat}
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  showUnit
                  onLegendChange={v => this.handleFilterChange('categories', v)}
                />
              )
          }
        </div>
      </div>
    );
  }
}

Energy.propTypes = {
  translations: PropTypes.shape({
    title: PropTypes.string,
    description: PropTypes.string,
    indicatorsLabel: PropTypes.string
  }),
  onFilterChange: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  selectedOptions: PropTypes.object,
  options: PropTypes.array
};

Energy.defaultProps = {
  translations: {},
  selectedOptions: {},
  options: [],
  chartData: {}
};

export default Energy;
