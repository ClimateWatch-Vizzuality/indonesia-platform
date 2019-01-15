import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import styles from './sectoral-circumstances-styles.scss';

import Forestry from './forestry';

class SectoralCircumstances extends PureComponent {
  render() {
    const { t } = this.props;
    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.sectoral-circumstances.title')}
          description={t('pages.regions.sectoral-circumstances.description')}
        />
        <Forestry />
      </div>
    );
  }
}

SectoralCircumstances.propTypes = { t: PropTypes.func.isRequired };

SectoralCircumstances.defaultProps = {};

export default SectoralCircumstances;
