import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Table } from 'cw-components';

import { renameKeys } from 'utils';
import SectionTitle from 'components/section-title';
import FundingOportunitiesProvider from 'providers/funding-oportunities-provider';
import InfoDownloadToolbox from 'components/info-download-toolbox';

import styles from './climate-funding-styles.scss';

class ClimateFunding extends PureComponent {
  render() {
    const { t, data, titleLinks, onSearchChange, sources } = this.props;
    const nt = key => t(`pages.national-context.climate-funding.${key}`);

    const tableHeaders = nt('table-headers', {});
    tableHeaders.website_link = 'website_link';
    const defaultColumns = Object.values(tableHeaders);

    const tableData = data.map(d => renameKeys(d, tableHeaders));

    const title = nt('title');
    const description = nt('description');

    return (
      <div className={styles.page}>
        <SectionTitle title={title} description={description} />
        <div>
          <div className={styles.actions}>
            <Input
              onChange={onSearchChange}
              placeholder={t(
                'pages.national-context.climate-funding.search-placeholder'
              )}
              theme={styles}
            />
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs={sources}
              downloadUri="funding_opportunities.zip"
              infoTooltipdata={t('common.table-data-info')}
              downloadTooltipdata={t('common.download-table-data-info')}
            />
          </div>
          <div className={styles.tableContainer}>
            <Table
              data={tableData && tableData}
              defaultColumns={defaultColumns}
              ellipsisColumns={[ tableHeaders.description ]}
              emptyValueLabel={t('common.table-empty-value')}
              horizontalScroll
              hiddenColumnHeaderLabels={[ tableHeaders.website_link ]}
              titleLinks={data && titleLinks}
            />
          </div>
        </div>
        <FundingOportunitiesProvider />
      </div>
    );
  }
}

ClimateFunding.propTypes = {
  t: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func.isRequired,
  data: PropTypes.array,
  titleLinks: PropTypes.array,
  sources: PropTypes.array
};

ClimateFunding.defaultProps = { data: [], titleLinks: null, sources: [] };

export default ClimateFunding;
