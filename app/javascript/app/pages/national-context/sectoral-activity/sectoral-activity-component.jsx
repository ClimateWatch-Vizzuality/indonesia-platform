import React, { Component } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import startCase from 'lodash/startCase';
import { Dropdown, PlayTimeline } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import Map from 'components/map';
import DotLegend from 'components/dot-legend';
import EmissionActivitiesProvider from 'providers/emission-activities-provider';
import AdaptationProvider from 'providers/adaptation-provider';
import dropdownStyles from 'styles/dropdown.scss';
import sortBy from 'lodash/sortBy';
import styles from './sectoral-activity-styles.scss';

class SectoralActivity extends Component {
  getLegend = () => {
    const { map } = this.props;
    const NO_DATA_NAME = 'No data';
    const noDataItem = map.legend &&
      map.legend.find(i => i.name === NO_DATA_NAME);
    const legend = sortBy(
      map.legend.filter(i => i.name !== NO_DATA_NAME),
      'name'
    );
    if (noDataItem) {
      legend.push(noDataItem);
    }

    return legend;
  };

  handleFilterChange = (filter, selected) => {
    const { onFilterChange, adaptationCode } = this.props;
    const isAdaptationSector = filter === 'indicator' &&
      selected.value === adaptationCode;
    const clear = isAdaptationSector;
    onFilterChange({ [filter]: selected.value }, clear);
  };

  handlePlay = () => {
    const { selectedOptions, onFilterChange, years } = this.props;
    const selectedYear = selectedOptions && selectedOptions.year;
    const initialYear = selectedYear && selectedYear.value;
    let currentYearIndex = 0;

    const playAtStart = setInterval(
      () => {
        if (years[currentYearIndex]) {
          onFilterChange({ year: String(years[currentYearIndex]) });
        }
        if (currentYearIndex > years.length - 1) {
          clearInterval(playAtStart);
          setTimeout(onFilterChange({ year: String(initialYear) }), 1000);
        }
        currentYearIndex += 1;
      },
      500
    );
  };

  renderDropdown = field => {
    const { options, selectedOptions } = this.props;
    const value = selectedOptions && selectedOptions[field];
    return (
      <Dropdown
        key={field}
        label={startCase(field)}
        placeholder={`Filter by ${startCase(field)}`}
        options={options[field] || []}
        onValueChange={selected => this.handleFilterChange(field, selected)}
        value={value || null}
        theme={{ select: dropdownStyles.select }}
        hideResetButton
      />
    );
  };

  renderTimeline = () => {
    const { years, selectedOptions } = this.props;
    const selectedYear = selectedOptions && selectedOptions.year;

    const yearsAsStrings = years.map(y => String(y));

    return (
      <div className={styles.timelineWrapper}>
        <PlayTimeline
          onPlay={this.handlePlay}
          years={yearsAsStrings}
          selectedYear={selectedYear && selectedYear.value}
        />
      </div>
    );
  };

  render() {
    const {
      translations,
      map,
      adaptationParams,
      selectedOptions,
      adaptationCode
    } = this.props;
    const yearsSelectable = selectedOptions.indicator &&
      selectedOptions.indicator.value !== adaptationCode;

    return (
      <div>
        <div className={styles.page}>
          <SectionTitle
            title={translations.title}
            description={translations.description}
          />
          <div className={styles.dropdowns}>
            {this.renderDropdown('indicator')}
            {yearsSelectable && this.renderDropdown('year')}
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs=""
              downloadUri=""
            />
          </div>
          <EmissionActivitiesProvider />
          <AdaptationProvider params={adaptationParams} />
        </div>
        <div className={styles.mapSection}>
          <div className={styles.mapContainer}>
            <Map
              zoom={5}
              paths={map.paths}
              forceUpdate
              customCenter={[ 172, -5 ]}
              className={styles.map}
            />
            <div className={styles.legend}>
              <DotLegend legend={this.getLegend()} />
            </div>
            {yearsSelectable && this.renderTimeline()}
          </div>
        </div>
      </div>
    );
  }
}

SectoralActivity.propTypes = {
  translations: PropTypes.object,
  map: PropTypes.shape({ paths: PropTypes.array, legend: PropTypes.array }),
  years: PropTypes.array,
  options: PropTypes.object,
  selectedOptions: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  adaptationParams: PropTypes.object.isRequired,
  adaptationCode: PropTypes.string.isRequired
};

SectoralActivity.defaultProps = {
  translations: {},
  map: {},
  options: {},
  years: [],
  selectedOptions: {}
};

export default SectoralActivity;
