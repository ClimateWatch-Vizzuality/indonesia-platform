import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import ClimatePlansProvider from 'providers/climate-plans-provider';
import { Switch, Input, Table, NoContent } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from './climate-sectoral-plan-styles.scss';

class ClimateSectoralPlan extends PureComponent {
  getOptions() {
    const { t } = this.props;

    return [
      {
        name: t('pages.regions.climate-sectoral-plan.development-plans'),
        value: 'development-plans',
        disabled: true
      },
      {
        name: t('pages.regions.climate-sectoral-plan.climate-plans'),
        value: 'climate-plans'
      }
    ];
  }

  render() {
    const { onSearchChange, data, t } = this.props;

    const defaultColumns = [ 'sector', 'sub_sector', 'mitigation_activities' ];
    const hasContent = data && data.length > 0;

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.climate-sectoral-plan.header')}
          description={t('pages.regions.climate-sectoral-plan.description')}
        />
        <div className={styles.switch}>
          <Switch
            options={this.getOptions()}
            selectedOption="climate-plans"
            theme={{
              wrapper: styles.wrapper,
              checkedOption: styles.checkedOption
            }}
          />
        </div>
        <div>
          <div className={styles.actions}>
            <Input
              onChange={onSearchChange}
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
                ? <Table
                  data={data && data}
                  defaultColumns={defaultColumns}
                  ellipsisColumns={[ 'description' ]}
                  emptyValueLabel={t('common.table-empty-value')}
                  horizontalScroll
                  parseMarkdown
                />
                : <NoContent
                  minHeight={330}
                  message={t('common.table-no-data')}
                />
            }
          </div>
        </div>
        <ClimatePlansProvider />
      </div>
    );
  }
}

ClimateSectoralPlan.propTypes = {
  t: PropTypes.func.isRequired,
  onSearchChange: PropTypes.func,
  data: PropTypes.array
};

ClimateSectoralPlan.defaultProps = {
  onSearchChange: () => {
  },
  data: []
};

export default ClimateSectoralPlan;
