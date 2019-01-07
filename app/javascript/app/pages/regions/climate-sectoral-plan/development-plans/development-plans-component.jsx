import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DevelopmentPlansProvider from 'providers/development-plans-provider';
import { Input, Table, NoContent } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from '../climate-plans/climate-plans-styles';

class DevelopmentPlans extends PureComponent {
  render() {
    const { data, handleFilterChange, t } = this.props;
    const defaultColumns = [
      'sector',
      'RPJMD_period',
      'supportive_policy_direction_in_RPJMD'
    ];
    const hasContent = data && data.length > 0;

    const options = [
      {
        label: t(
          'pages.regions.climate-sectoral-plan.development-plans-csv-download'
        ),
        value: 'csv',
        url: 'province/development_plans'
      },
      {
        label: t(
          'pages.regions.climate-sectoral-plan.development-plans-pdf-download'
        ),
        value: 'pdf',
        url: 'province/development_plans'
      }
    ];

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
            infoTooltipdata={t('common.table-data-info')}
            downloadTooltipdata={t('common.download-options-table-data-info')}
            downloadOptions={options}
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
        <DevelopmentPlansProvider />
      </div>
    );
  }
}

DevelopmentPlans.propTypes = {
  handleFilterChange: PropTypes.func,
  data: PropTypes.array,
  t: PropTypes.func
};

DevelopmentPlans.defaultProps = {
  handleFilterChange: () => {
  },
  data: [],
  t: () => {
  }
};

export default DevelopmentPlans;
