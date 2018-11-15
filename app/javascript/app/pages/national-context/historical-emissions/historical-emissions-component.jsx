import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import WorldBankProvider from 'providers/world-bank-provider';
import SectionTitle from 'components/section-title';
import { Switch, Chart, Dropdown, Multiselect } from 'cw-components';
import { ALL_SELECTED, ALL_SELECTED_OPTION } from 'constants/constants';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import lineIcon from 'assets/icons/line_chart.svg';
import areaIcon from 'assets/icons/area_chart.svg';
import styles from './historical-emissions-styles.scss';

const NON_COLUMN_KEYS = [ 'breakBy', 'chartType' ];

const addAllSelected = (filterOptions, field) => {
  const noAllSelected = NON_COLUMN_KEYS.includes(field);
  if (noAllSelected) return filterOptions && filterOptions[field];
  return filterOptions &&
    filterOptions[field] &&
    [ ALL_SELECTED_OPTION, ...filterOptions[field] ] ||
    [];
};

class Historical extends PureComponent {
  handleFilterChange = (filter, selected) => {
    const { onFilterChange } = this.props;
    let values;
    if (isArray(selected)) {
      values = selected.length === 0 ||
        selected[selected.length - 1].label === ALL_SELECTED
        ? ALL_SELECTED
        : selected
          .filter(v => v.value !== ALL_SELECTED)
          .map(v => v.value)
          .join(',');
    } else {
      values = selected.value;
    }
    onFilterChange({ [filter]: values });
  };

  renderDropdown(field, multi) {
    const { selectedOptions, filterOptions } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const iconsProp = {};
    // TODO: Fix icons
    if (multi)
      return (
        <Multiselect
          key={field}
          label={startCase(field)}
          placeholder={`Filter by ${startCase(field)}`}
          options={addAllSelected(filterOptions, field)}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={(isArray(value) ? value : [ value ]) || null}
          hideResetButton
        />
      );
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
    const {
      emissionParams,
      selectedOptions,
      chartData,
      fieldToBreakBy
    } = this.props;
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
          {this.renderDropdown('provinces', true)}
          {this.renderDropdown('sector', true)}
          {this.renderDropdown('gas', true)}
          {this.renderDropdown('chartType', false, icons)}
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs=""
            downloadUri=""
          />
        </div>
        <div className={styles.chartContainer}>
          {
            chartData &&
              chartData.data &&
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
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  loading={chartData.loading}
                  onLegendChange={v =>
                    this.handleFilterChange(fieldToBreakBy, v)}
                />
              )
          }
        </div>
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        <WorldBankProvider />
      </div>
    );
  }
}

Historical.propTypes = {
  emissionParams: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  fieldToBreakBy: PropTypes.string,
  filterOptions: PropTypes.object,
  chartData: PropTypes.object
};

Historical.defaultProps = {
  emissionParams: null,
  selectedOptions: null,
  fieldToBreakBy: null,
  filterOptions: null,
  chartData: null
};

export default Historical;
