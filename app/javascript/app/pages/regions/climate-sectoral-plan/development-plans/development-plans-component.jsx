import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import DevelopmentPlansProvider from 'providers/climate-plans-provider';
import { Input, Table, NoContent } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from './climate-plans-styles';

class DevelopmentPlans extends PureComponent {
  handleFilterChange = (field, selected) => {
    const { onFilterChange } = this.props;
    onFilterChange({ [field]: selected });
  };

  render() {
    const { data } = this.props;
    const defaultColumns = [ 'sector', 'sub_sector', 'mitigation_activities' ];
    const hasContent = data && data.length > 0;

    return (
      <div>
        <div className={styles.actions}>
          <Input
            onChange={value => this.handleFilterChange('search', value)}
            placeholder="Search"
            theme={styles}
          />
          <InfoDownloadToolbox
            className={{ buttonWrapper: styles.buttonWrapper }}
            slugs=""
            downloadUri="province/climate_plans"
            infoTooltipdata="Table data information"
            downloadTooltipdata="Download table data in .csv"
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
                  emptyValueLabel="Not specified"
                  horizontalScroll
                  parseMarkdown
                />
)
              : <NoContent minHeight={330} message="No data found" />
          }
        </div>
        <DevelopmentPlansProvider />
      </div>
    );
  }
}

DevelopmentPlans.propTypes = {
  onFilterChange: PropTypes.func,
  data: PropTypes.array
};

DevelopmentPlans.defaultProps = {
  onFilterChange: () => {
  },
  data: []
};

export default DevelopmentPlans;
