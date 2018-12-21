import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { getClimateSectoralPlanData } from './climate-sectoral-plan-selectors';
import Component from './climate-sectoral-plan-component';

import * as actions from './climate-sectoral-plan-actions';

const mapStateToProps = getClimateSectoralPlanData;

class ClimateSectoralPlanContainer extends PureComponent {
  onSearchChange = value => {
    const { updateFiltersSelected, query, provinceIso } = this.props;

    updateFiltersSelected({
      section: 'climate-sectoral-plan',
      region: provinceIso,
      query: { ...query, search: value }
    });
  };

  render() {
    return <Component {...this.props} onSearchChange={this.onSearchChange} />;
  }
}

ClimateSectoralPlanContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceIso: PropTypes.string
};

ClimateSectoralPlanContainer.defaultProps = { query: {}, provinceIso: '' };

export default connect(mapStateToProps, actions)(ClimateSectoralPlanContainer);
