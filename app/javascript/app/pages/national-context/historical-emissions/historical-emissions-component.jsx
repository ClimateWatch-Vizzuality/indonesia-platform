import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import MetadataProvider from 'providers/metadata-provider';
import GHGEmissionsProvider from 'providers/ghg-emissions-provider';
import SectionTitle from 'components/section-title';
import styles from './historical-emissions-styles.scss';

class Historical extends PureComponent {
  render() {
    const { emissionsParams } = this.props;
    const { title, description } = {
      title: 'Historical emissions',
      description: 'Historical Emissions description'
    };
    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <MetadataProvider meta="ghg" />
        {emissionsParams && <GHGEmissionsProvider params={emissionsParams} />}
      </div>
    );
  }
}

Historical.propTypes = { emissionsParams: PropTypes.object };

Historical.defaultProps = { emissionsParams: null };

export default Historical;
