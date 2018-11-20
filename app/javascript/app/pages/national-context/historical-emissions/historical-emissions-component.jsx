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
  TOP_10_EMMITERS
} from 'constants/constants';
import startCase from 'lodash/startCase';
import isArray from 'lodash/isArray';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import lineIcon from 'assets/icons/line_chart';
import areaIcon from 'assets/icons/area_chart';
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
  handleFilterChange = (filter, selected) => {
    const { onFilterChange, top10EmmitersOption } = this.props;
    let values;
    if (isArray(selected)) {
      if (selected[selected.length - 1].label === TOP_10_EMMITERS)
        values = top10EmmitersOption.value;
      else {
        values = selected.length === 0 ||
          selected[selected.length - 1].label === ALL_SELECTED
          ? ALL_SELECTED
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
    onFilterChange({ [filter]: values });
  };

  renderDropdown(field, multi, icons) {
    const { selectedOptions, filterOptions } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const iconsProp = icons ? { icons } : {};
    if (multi)
      return filterOptions[field] &&
        (
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
      fieldToBreakBy
    } = this.props;
    const { title, description } = {
      title: 'Historical emissions',
      description: 'Historical Emissions description'
    };
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
  filterOptions: PropTypes.object,
  chartData: PropTypes.object,
  top10EmmitersOption: PropTypes.object
};

Historical.defaultProps = {
  emissionParams: null,
  selectedOptions: null,
  fieldToBreakBy: null,
  filterOptions: null,
  chartData: null,
  top10EmmitersOption: null
};

export default Historical;
