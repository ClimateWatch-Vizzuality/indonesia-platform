import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { Input, Table, NoContent } from 'cw-components';

import { renameKeys } from 'utils';
import DevelopmentPlansProvider from 'providers/development-plans-provider';
import InfoDownloadToolbox from 'components/info-download-toolbox';

import styles from '../climate-plans/climate-plans-styles';

class DevelopmentPlans extends PureComponent {
  renderTable(nt) {
    const { data, t } = this.props;
    const hasContent = data && data.length > 0;

    if (!hasContent) {
      return <NoContent minHeight={330} message={t('common.table-no-data')} />;
    }

    const tableHeaders = nt('development-plans-table-headers', {});
    const defaultColumns = Object.values(tableHeaders);

    const tableData = data.map(d => renameKeys(d, tableHeaders));

    return (
      <Table
        data={tableData}
        defaultColumns={defaultColumns}
        setColumnWidth={() => 250}
        ellipsisColumns={[ tableHeaders.description ]}
        emptyValueLabel={t('common.table-empty-value')}
        horizontalScroll
        parseMarkdown
      />
    );
  }

  render() {
    const { handleFilterChange, t, provinceIso } = this.props;
    // namespaced t
    const nt = key => t(`pages.regions.climate-sectoral-plan.${key}`);
    const options = [
      {
        label: nt('csv-download'),
        value: 'csv',
        url: 'province/development_plans'
      },
      {
        label: nt('pdf-download'),
        value: 'pdf',
        url: `http://wri-sites.s3.amazonaws.com/climatewatch.org/www.climatewatch.org/indonesia/documents/development-plans/${provinceIso}.pdf`
      }
    ];

    return (
      <div>
        <div className={styles.actions}>
          <Input
            onChange={value => handleFilterChange('search', value)}
            placeholder={nt('search-placeholder')}
            theme={styles}
          />
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs=""
            infoTooltipdata={t('common.table-data-info')}
            downloadTooltipdata={t('common.download-options-table-data-info')}
            downloadOptions={options}
          />
        </div>
        <div className={styles.tableContainer}>
          {this.renderTable(nt)}
        </div>
        <DevelopmentPlansProvider />
      </div>
    );
  }
}

DevelopmentPlans.propTypes = {
  handleFilterChange: PropTypes.func,
  data: PropTypes.array,
  t: PropTypes.func,
  provinceIso: PropTypes.string.isRequired
};

DevelopmentPlans.defaultProps = {
  handleFilterChange: () => {
  },
  data: [],
  t: () => {
  }
};

export default DevelopmentPlans;
