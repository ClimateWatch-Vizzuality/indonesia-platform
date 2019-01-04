import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import SectionTitle from 'components/section-title';
import { Switch } from 'cw-components';
import ClimatePlans from './climate-plans';
import DevelopmentPlans from './development-plans';
import styles from './climate-sectoral-plan-styles.scss';

const SwitchOptions = {
  'development-plans': DevelopmentPlans,
  'climate-plans': ClimatePlans
};

const DEFAULT_SELECTED_OPTION = 'climate-plans';

class ClimateSectoralPlan extends PureComponent {
  constructor() {
    super();
    this.state = { selectedOption: DEFAULT_SELECTED_OPTION };
  }

  getOptions = () => {
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
  };

  handleFilterChange = (field, selected) => {
    const { onFilterChange } = this.props;
    if (field === 'plans') {
      this.setState({ selectedOption: selected });
    }
    onFilterChange({ [field]: selected });
  };

  render() {
    const { t } = this.props;
    const { selectedOption } = this.state;

    const SwitchOptionComponent = SwitchOptions[selectedOption];

    return (
      <div className={styles.page}>
        <SectionTitle
          title={t('pages.regions.climate-sectoral-plan.header')}
          description={t('pages.regions.climate-sectoral-plan.description')}
        />
        <div className={styles.switch}>
          <Switch
            options={this.getOptions()}
            selectedOption={selectedOption}
            onClick={selOption =>
              this.handleFilterChange('plans', selOption.value)}
            theme={{
              wrapper: styles.wrapper,
              checkedOption: styles.checkedOption
            }}
          />
        </div>
        <SwitchOptionComponent handleFilterChange={this.handleFilterChange} />
      </div>
    );
  }
}

ClimateSectoralPlan.propTypes = {
  t: PropTypes.func.isRequired,
  onFilterChange: PropTypes.func
};

ClimateSectoralPlan.defaultProps = {
  onFilterChange: () => {
  }
};

export default ClimateSectoralPlan;
