import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import GHGTargetEmissionsProvider from 'providers/ghg-target-emissions-provider';
import SectionTitle from 'components/section-title';
import { Switch, Chart, Dropdown, Multiselect } from 'cw-components';
import { METRIC_OPTIONS, SECTOR_TOTAL } from 'constants/constants';
import { format } from 'd3-format';
import startCase from 'lodash/startCase';
import kebabCase from 'lodash/kebabCase';
import castArray from 'lodash/castArray';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import dropdownStyles from 'styles/dropdown.scss';
import lineIcon from 'assets/icons/line_chart.svg';
import areaIcon from 'assets/icons/area_chart.svg';
import styles from './historical-emissions-styles.scss';

const NON_ALL_SELECTED_KEYS = [ 'breakBy', 'chartType', 'provinces' ];

class Historical extends PureComponent {
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

  addAllSelected(field) {
    const { filterOptions, allSelectedOption, metricSelected } = this.props;
    const absoluteMetric = metricSelected === METRIC_OPTIONS.ABSOLUTE_VALUE;

    if (!filterOptions) return [];

    let options = filterOptions[field] || [];

    if (absoluteMetric && field === 'sector') {
      options = options.filter(v => v.code !== SECTOR_TOTAL);
    }

    const noAllSelected = NON_ALL_SELECTED_KEYS.includes(field);

    if (noAllSelected) return options;

    return [ allSelectedOption, ...options ];
  }

  renderDropdown(field, multi, icons) {
    const { selectedOptions, filterOptions, metricSelected, t } = this.props;
    const value = selectedOptions && selectedOptions[field];
    const iconsProp = icons ? { icons } : {};
    const isChartReady = filterOptions.source;
    if (!isChartReady) return null;

    const label = t(
      `pages.national-context.historical-emissions.labels.${kebabCase(field)}`
    );

    if (multi) {
      const absoluteMetric = metricSelected === METRIC_OPTIONS.ABSOLUTE_VALUE;
      const disabled = field === 'sector' && !absoluteMetric;

      const values = castArray(value).filter(v => v);

      return (
        <Multiselect
          key={field}
          label={label}
          placeholder={`Filter by ${startCase(field)}`}
          options={this.addAllSelected(field)}
          onValueChange={selected => this.handleFilterChange(field, selected)}
          values={values}
          theme={{ wrapper: dropdownStyles.select }}
          hideResetButton
          disabled={disabled}
        />
      );
    }
    return (
      <Dropdown
        key={field}
        label={label}
        placeholder={`Filter by ${startCase(field)}`}
        options={this.addAllSelected(field)}
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
      t
    } = this.props;

    const icons = { line: lineIcon, area: areaIcon };
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.national-context.historical-emissions.title')}
          description={t(
            'pages.national-context.historical-emissions.description'
          )}
        />
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
                  getCustomYLabelFormat={value => format('.3s')(value)}
                  showUnit
                />
              )
          }
        </div>
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        {emissionParams && <GHGTargetEmissionsProvider />}
      </div>
    );
  }
}

Historical.propTypes = {
  t: PropTypes.func.isRequired,
  emissionParams: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  fieldToBreakBy: PropTypes.string,
  metricSelected: PropTypes.string,
  filterOptions: PropTypes.object,
  chartData: PropTypes.object,
  allSelectedOption: PropTypes.object
};

Historical.defaultProps = {
  emissionParams: undefined,
  selectedOptions: undefined,
  fieldToBreakBy: undefined,
  metricSelected: undefined,
  filterOptions: undefined,
  chartData: undefined,
  allSelectedOption: undefined
};

export default Historical;
