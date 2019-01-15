import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import castArray from 'lodash/castArray';
import kebabCase from 'lodash/kebabCase';

import { Dropdown, Multiselect } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import SectionTitle from 'components/section-title';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import GHGTargetEmissionsProvider from 'providers/ghg-target-emissions-provider';

import dropdownStyles from 'styles/dropdown.scss';
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

  render() {
    const { emissionParams, t } = this.props;

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.regions-ghg-emissions.title')}
          description={t('pages.regions.regions-ghg-emissions.description')}
        />
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
        <div className={styles.chartContainer} />
        <MetadataProvider meta="ghg" />
        {emissionParams && <GHGEmissionsProvider params={emissionParams} />}
        {emissionParams && <GHGTargetEmissionsProvider />}
      </div>
    );
  }
}

RegionsGhgEmissions.propTypes = {
  t: PropTypes.func.isRequired,
  emissionParams: PropTypes.object,
  onFilterChange: PropTypes.func.isRequired,
  selectedOptions: PropTypes.object,
  filterOptions: PropTypes.object
  /* allSelectedOption: PropTypes.object */
};

RegionsGhgEmissions.defaultProps = {
  emissionParams: undefined,
  selectedOptions: undefined,
  filterOptions: undefined
  /* allSelectedOption: undefined */
};

export default RegionsGhgEmissions;
