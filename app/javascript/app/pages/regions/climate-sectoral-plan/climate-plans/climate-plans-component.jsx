import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import ClimatePlansProvider from 'providers/climate-plans-provider';
import { Input, Table, NoContent } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from './climate-plans-styles.scss';

class ClimatePlans extends PureComponent {
  render() {
    const { data, t, handleFilterChange } = this.props;
    const defaultColumns = [ 'sector', 'sub_sector', 'mitigation_activities' ];
    const hasContent = data && data.length > 0;

    return (
      <div>
        <div className={styles.actions}>
          <Input
            onChange={value => handleFilterChange('search', value)}
            placeholder={t(
              'pages.regions.climate-sectoral-plan.search-placeholder'
            )}
            theme={styles}
          />
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs=""
            downloadUri="province/climate_plans"
            infoTooltipdata={t('common.table-data-info')}
            downloadTooltipdata={t('common.download-table-data-info')}
          />
        </div>
        <div className={styles.tableContainer}>
          {
            hasContent
              ? (
                <Table
                  data={data && data}
                  defaultColumns={defaultColumns}
                  ellipsisColumns={[ 'description' ]}
                  emptyValueLabel={t('common.table-empty-value')}
                  horizontalScroll
                  parseMarkdown
                />
)
              : (
                <NoContent
                  minHeight={330}
                  message={t('common.table-no-data')}
                />
)
          }
        </div>
        <ClimatePlansProvider />
      </div>
    );
  }
}

ClimatePlans.propTypes = {
  handleFilterChange: PropTypes.func,
  data: PropTypes.array,
  t: PropTypes.func
};

ClimatePlans.defaultProps = {
  handleFilterChange: () => {
  },
  data: [],
  t: () => {
  }
};

export default ClimatePlans;
