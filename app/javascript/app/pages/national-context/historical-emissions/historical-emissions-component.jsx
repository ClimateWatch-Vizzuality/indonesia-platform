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

const areaIcon = require('assets/icons/area_chart');

const SOURCE_OPTIONS = [
  { name: 'CAIT SOURCE', value: 'cait' },
  { name: 'SIGN SMART SOURCE', value: 'sign-smart' }
];
const CHART_TYPE_OPTIONS = [
  { label: 'area', value: 'area' },
  { label: 'line', value: 'line' },
  { label: 'percentage', value: 'percentage ' }
];

const getOptions = (filterOptions, field) => {
  const NON_COLUMN_KEYS = [ 'break_by' ];
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

  renderDropdown(field, isColumnField, icons) {
    const { selectedOptions, filterOptions } = this.props;
    const value = isColumnField
      ? selectedOptions && selectedOptions[field] && selectedOptions[field][0]
      : selectedOptions && selectedOptions[field];
    const updatedFilterOptions = field === 'chart type'
      ? CHART_TYPE_OPTIONS
      : filterOptions;
    return (
      <Dropdown
        key={field}
        label={startCase(field)}
        placeholder={`Filter by ${startCase(field)}`}
        options={getOptions(updatedFilterOptions, field)}
        onValueChange={selected =>
          this.handleFiltersChange(field, selected && selected.value)}
        value={value || null}
        icons={icons}
        hideResetButton
      />
    );
  }

  render() {
    const {
      emissionsParams,
      selectedSource,
      selectedOptions,
      chartData
    } = this.props;
    const { title, description } = {
      title: 'Historical emissions',
      description: 'Historical Emissions description'
    };
    const icons = { area: areaIcon.default };
    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <div className={styles.switch}>
          <div className="switch-container">
            <Switch
              options={SOURCE_OPTIONS}
              onClick={value => this.handleFilterChange('source', value)}
              selectedOption={selectedSource}
              theme={{ wrapper: styles.switchWrapper, option: styles.option }}
            />
          </div>
        </div>
        <div className={styles.dropdowns}>
          {this.renderDropdown('break by')}
          {this.renderDropdown('provinces', true)}
          {this.renderDropdown('sector', true)}
          {this.renderDropdown('gas', true)}
          {this.renderDropdown('chart type', icons)}
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
                type={selectedOptions && selectedOptions.chartType}
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
  selectedSource: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  filterOptions: PropTypes.object,
  chartData: PropTypes.object
};

Historical.defaultProps = {
  emissionsParams: null,
  selectedSource: 'cait',
  selectedOptions: null,
  filterOptions: null,
  chartData: null
};

export default Historical;
