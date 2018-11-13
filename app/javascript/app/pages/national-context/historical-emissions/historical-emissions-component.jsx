import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import SectionTitle from 'components/section-title';
import { Switch } from 'cw-components';
import styles from './historical-emissions-styles.scss';

const SOURCE_OPTIONS = [
  { name: 'CAIT SOURCE', value: 'cait' },
  { name: 'SIGN SMART SOURCE', value: 'sign-smart' }
];

class Historical extends PureComponent {
  handleSourceChange = ({ value }) => {
    const { onFilterChange } = this.props;
    onFilterChange({ source: value });
  };

  render() {
    const { emissionsParams, selectedSource } = this.props;
    const { title, description } = {
      title: 'Historical emissions',
      description: 'Historical Emissions description'
    };
    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <div className={styles.switch}>
          <div className="switch-container">
            <Switch
              options={SOURCE_OPTIONS}
              onClick={this.handleSourceChange}
              selectedOption={selectedSource}
              theme={{ wrapper: styles.switchWrapper, option: styles.option }}
            />
          </div>
        </div>
        <MetadataProvider meta="ghg" />
        {emissionsParams && <GHGEmissionsProvider params={emissionsParams} />}
      </div>
    );
  }
}

Historical.propTypes = {
  emissionsParams: PropTypes.object,
  selectedSource: PropTypes.string,
  onFilterChange: PropTypes.func.isRequired
};

Historical.defaultProps = { emissionsParams: null, selectedSource: 'cait' };

export default Historical;
