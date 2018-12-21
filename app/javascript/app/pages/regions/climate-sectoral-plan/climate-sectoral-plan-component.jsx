import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import ClimatePlansProvider from 'providers/climate-plans-provider';
import { Switch, Input, Table } from 'cw-components';
import InfoDownloadToolbox from 'components/info-download-toolbox';
import styles from './climate-sectoral-plan-styles.scss';

const options = [
  { name: 'Development Plans', value: 'development-plans', disabled: true },
  { name: 'Climate Plans', value: 'climate-plans' }
];

class ClimateSectoralPlan extends PureComponent {
  render() {
    const { translations, onSearchChange, data } = this.props;

    const defaultColumns = [ 'sector', 'sub_sector', 'mitigation_activities' ];

    return (
      <div className={styles.page}>
        <SectionTitle
          title={translations.title}
          description={translations.description}
        />
        <div className={styles.switch}>
          <Switch
            options={options}
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
              placeholder="Search"
              theme={styles}
            />
            <InfoDownloadToolbox
              className={{ buttonWrapper: styles.buttonWrapper }}
              slugs=""
              downloadUri="funding_opportunities"
              infoTooltipdata="Table data information"
              downloadTooltipdata="Download table data in .csv"
            />
          </div>
          <div className={styles.tableContainer}>
            <Table
              data={data && data}
              defaultColumns={defaultColumns}
              ellipsisColumns={[ 'description' ]}
              emptyValueLabel="Not specified"
              horizontalScroll
              parseMarkdown
            />
          </div>
        </div>
        <ClimatePlansProvider />
      </div>
    );
  }
}

ClimateSectoralPlan.propTypes = {
  translations: PropTypes.object,
  onSearchChange: PropTypes.func,
  data: PropTypes.array
};

ClimateSectoralPlan.defaultProps = {
  translations: {},
  onSearchChange: () => {
  },
  data: []
};

export default ClimateSectoralPlan;
