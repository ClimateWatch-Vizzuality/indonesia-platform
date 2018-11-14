import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import SectionTitle from 'components/section-title';
import { Switch, Chart, Dropdown } from 'cw-components';
import { ALL_SELECTED_OPTION } from 'constants/constants';
import startCase from 'lodash/startCase';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from './historical-emissions-styles.scss';

const lineIcon = require('assets/icons/line_chart');
const areaIcon = require('assets/icons/area_chart');

const addAllSelected = (filterOptions, field) => {
  const NON_COLUMN_KEYS = [ 'breakBy', 'chartType' ];
  const noAllSelected = NON_COLUMN_KEYS.includes(field);
  if (noAllSelected) return filterOptions && filterOptions[field];
  return filterOptions &&
    filterOptions[field] &&
    [ ALL_SELECTED_OPTION, ...filterOptions[field] ] ||
    [];
};

class Historical extends PureComponent {
  handleFilterChange = (filter, { value }) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [filter]: value });
  };

  renderDropdown(field, icons) {
    const { selectedOptions, filterOptions } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const iconsProp = icons ? { icons, iconsDropdown: true } : {};
    return (
      <Dropdown
        key={field}
        label={startCase(field)}
        placeholder={`Filter by ${startCase(field)}`}
        options={addAllSelected(filterOptions, field)}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        hideResetButton
        {...iconsProp}
      />
    );
  }

  renderSwitch() {
    const { filterOptions, selectedOptions } = this.props;
    return selectedOptions.source && (
    <div className={styles.switch}>
      <div className="switch-container">
        <Switch
          options={filterOptions.source}
          onClick={value => this.handleFilterChange('source', value)}
          selectedOption={selectedOptions.source.value}
          theme={{ wrapper: styles.switchWrapper, option: styles.option }}
        />
      </div>
    </div>
      );
  }

  render() {
    const { emissionsParams, selectedOptions, chartData } = this.props;
    const { title, description } = {
      title: 'Historical emissions',
      description: 'Historical Emissions description'
    };
    const icons = { line: lineIcon.default, area: areaIcon.default };
    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        {this.renderSwitch()}
        <div className={styles.dropdowns}>
          {this.renderDropdown('breakBy')}
          {this.renderDropdown('provinces')}
          {this.renderDropdown('sector')}
          {this.renderDropdown('gas')}
          {this.renderDropdown('chartType', icons)}
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
                type={
                  selectedOptions &&
                    selectedOptions.chartType &&
                    selectedOptions.chartType.value
                }
                config={chartData.config}
                data={chartData.data}
                projectedData={chartData.projectedData}
                domain={chartData.domain}
                dataOptions={chartData.filters}
                dataSelected={chartData.filtersSelected}
                height={500}
                loading={chartData.loading}
                onLegendChange={v =>
                  this.handleFilterChange(selectedOptions.breakBy, v)}
              />
            )
        }
        <MetadataProvider meta="ghg" />
        {emissionsParams && <GHGEmissionsProvider params={emissionsParams} />}
      </div>
    );
  }
}

Historical.propTypes = {
  emissionsParams: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  filterOptions: PropTypes.object,
  chartData: PropTypes.object
};

Historical.defaultProps = {
  emissionsParams: null,
  selectedOptions: null,
  filterOptions: null,
  chartData: null
};

export default Historical;
