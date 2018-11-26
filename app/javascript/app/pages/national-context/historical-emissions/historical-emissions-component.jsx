import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import GHGTargetEmissionsProvider from 'providers/ghg-target-emissions-provider';
import WorldBankProvider from 'providers/world-bank-provider';
import SectionTitle from 'components/section-title';
import { Switch, Chart, Dropdown, Multiselect } from 'cw-components';
import {
  ALL_SELECTED,
  ALL_SELECTED_OPTION,
  TOP_10_EMMITERS,
  METRIC_OPTIONS
} from 'constants/constants';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import dropdownStyles from 'styles/dropdown.scss';
import lineIcon from 'assets/icons/line_chart.svg';
import areaIcon from 'assets/icons/area_chart.svg';
import styles from './historical-emissions-styles.scss';

const NON_ALL_SELECTED_KEYS = [ 'breakBy', 'chartType', 'provinces' ];

const addAllSelected = (filterOptions, field) => {
  const noAllSelected = NON_ALL_SELECTED_KEYS.includes(field);
  if (noAllSelected) return filterOptions && filterOptions[field];
  return filterOptions &&
    filterOptions[field] &&
    [ ALL_SELECTED_OPTION, ...filterOptions[field] ];
};

class Historical extends PureComponent {
  handleFilterChange = (field, selected) => {
    const { onFilterChange, top10EmmitersOption } = this.props;
    let values;
    const noSelectionValue = field === 'provinces'
      ? top10EmmitersOption.value
      : ALL_SELECTED;
    if (isArray(selected)) {
      if (
        selected.length > 0 &&
          selected[selected.length - 1].label === TOP_10_EMMITERS
      )
        values = top10EmmitersOption.value;
      else {
        values = selected.length === 0 ||
          selected[selected.length - 1].label === ALL_SELECTED
          ? noSelectionValue
          : selected
            .filter(
              v =>
                v.value !== ALL_SELECTED &&
                  v.value !== top10EmmitersOption.value
            )
            .map(v => v.value)
            .join(',');
      }
    } else {
      values = selected.value;
    }
    onFilterChange({ [field]: values });
  };

  renderDropdown(field, multi, icons) {
    const { selectedOptions, filterOptions, metricSelected } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const iconsProp = icons ? { icons } : {};
    if (multi) {
      const disabled = field === 'sector' &&
        metricSelected !== METRIC_OPTIONS.ABSOLUTE_VALUE.value;
      return (
        <Multiselect
          key={field}
          label={startCase(field)}
          placeholder={`Filter by ${startCase(field)}`}
          options={addAllSelected(filterOptions, field)}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={(isArray(value) ? value : [ value ]) || null}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
          disabled={disabled}
        />
      );
    }
    return (
      <Dropdown
        key={field}
        label={startCase(field)}
        placeholder={`Filter by ${startCase(field)}`}
        options={addAllSelected(filterOptions, field)}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
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
          selectedOption={String(selectedOptions.source.value)}
          theme={{
                wrapper: styles.switchWrapper,
                option: styles.option,
                checkedOption: styles.checkedOption
              }}
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
      fieldToBreakBy,
      title,
      description
    } = this.props;
    const icons = { line: lineIcon, area: areaIcon };

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
                  theme={{
                    legend: styles.legend,
                    projectedLegend: styles.projectedLegend
                  }}
                  type={
                    selectedOptions &&
                      selectedOptions.chartType &&
                      selectedOptions.chartType.value
                  }
                  config={chartData.config}
                  data={chartData.data}
                  projectedData={chartData.projectedData || []}
                  domain={chartData.domain}
                  dataOptions={chartData.dataOptions}
                  dataSelected={chartData.dataSelected}
                  height={500}
                  loading={chartData.loading}
                  onLegendChange={v =>
                    this.handleFilterChange(fieldToBreakBy, v)}
                  getCustomYLabelFormat={label => format('.3s')(label)}
                  showUnit
                />
              )
          }
        </div>
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        {emissionParams && <GHGTargetEmissionsProvider />}
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
  metricSelected: PropTypes.string,
  filterOptions: PropTypes.object,
  chartData: PropTypes.object,
  top10EmmitersOption: PropTypes.object,
  title: PropTypes.string.isRequired,
  description: PropTypes.string.isRequired
};

Historical.defaultProps = {
  emissionParams: undefined,
  selectedOptions: undefined,
  fieldToBreakBy: undefined,
  metricSelected: undefined,
  filterOptions: undefined,
  chartData: undefined,
  top10EmmitersOption: undefined
};

export default Historical;
