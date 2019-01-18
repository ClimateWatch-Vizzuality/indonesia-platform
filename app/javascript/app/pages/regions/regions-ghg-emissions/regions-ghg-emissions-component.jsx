import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import castArray from 'lodash/castArray';
import kebabCase from 'lodash/kebabCase';
import { format } from 'd3-format';

import { Chart, Dropdown, Multiselect } from 'cw-components';

import { TabletLandscape } from 'components/responsive';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import SectionTitle from 'components/section-title';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import GHGTargetEmissionsProvider from 'providers/ghg-target-emissions-provider';
import dropdownStyles from 'styles/dropdown.scss';
import GHGMap from './ghg-map';

import styles from './regions-ghg-emissions-styles.scss';

class RegionsGhgEmissions extends PureComponent {
  handleFilterChange = (field, selected) => {
    const { onFilterChange, selectedOptions } = this.props;

    const prevSelectedOptionValues = castArray(selectedOptions[field]).map(
      o => o.value
    );
    const selectedArray = castArray(selected);
    const newSelectedOption = selectedArray.find(
      o => !prevSelectedOptionValues.includes(o.value)
    );

    const removedAnyPreviousOverride = selectedArray
      .filter(v => v)
      .filter(v => !v.override);

    const values = newSelectedOption && newSelectedOption.override
      ? newSelectedOption.value
      : removedAnyPreviousOverride.map(v => v.value).join(',');

    onFilterChange({ [field]: values });
  };

  renderDropdown(field, multi) {
    const { selectedOptions, filterOptions, t } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const options = filterOptions[field] || [];

    const label = t(
      `pages.regions.regions-ghg-emissions.labels.${kebabCase(field)}`
    );

    if (multi) {
      const values = castArray(value).filter(v => v);

      return (
        <Multiselect
          key={field}
          label={label}
          options={options}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={values}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
        />
      );
    }
    return (
      <Dropdown
        key={field}
        label={label}
        options={options}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
      />
    );
  }

  renderChart() {
    const { chartData, onYearChange } = this.props;

    if (!chartData || !chartData.data) return null;

    return (
      <Chart
        theme={{
          legend: styles.legend,
          projectedLegend: styles.projectedLegend
        }}
        type="line"
        config={chartData.config}
        data={chartData.data}
        projectedData={chartData.projectedData || []}
        domain={chartData.domain}
        dataOptions={chartData.dataOptions}
        dataSelected={chartData.dataSelected}
        height={500}
        loading={chartData.loading}
        getCustomYLabelFormat={value => format('.3s')(value)}
        showUnit
        onLegendChange={v => this.handleFilterChange('sector', v)}
        onMouseMove={onYearChange}
      />
    );
  }

  render() {
    const { emissionParams, selectedYear, t } = this.props;

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.regions-ghg-emissions.title')}
          description={t('pages.regions.regions-ghg-emissions.description')}
        />
        <div className={styles.chartMapContainer}>
          <div className={styles.filtersChartContainer}>
            <div className={styles.dropdowns}>
              {this.renderDropdown('sector', true)}
              {this.renderDropdown('gas', true)}
              {this.renderDropdown('metric', false)}
              <InfoDownloadToolbox
                className={{ buttonWrapper: styles.buttonWrapper }}
                slugs=""
                downloadUri=""
              />
            </div>
            <div className={styles.chartContainer}>
              {this.renderChart()}
            </div>
          </div>
          <TabletLandscape>
            <GHGMap selectedYear={selectedYear} />
          </TabletLandscape>
        </div>
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        {emissionParams && <GHGTargetEmissionsProvider />}
      </div>
    );
  }
}

RegionsGhgEmissions.propTypes = {
  t: PropTypes.func.isRequired,
  chartData: PropTypes.object,
  emissionParams: PropTypes.object,
  selectedOptions: PropTypes.object,
  filterOptions: PropTypes.object,
  selectedYear: PropTypes.number,
  onFilterChange: PropTypes.func.isRequired,
  onYearChange: PropTypes.func.isRequired
};

RegionsGhgEmissions.defaultProps = {
  chartData: undefined,
  emissionParams: undefined,
  selectedOptions: undefined,
  filterOptions: undefined,
  selectedYear: null
};

export default RegionsGhgEmissions;
