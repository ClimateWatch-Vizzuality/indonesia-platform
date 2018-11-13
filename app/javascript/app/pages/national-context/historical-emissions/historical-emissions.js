import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Component from './historical-emissions-component';
import * as actions from './historical-emissions-actions';
import { getGHGEmissions } from './historical-emissions-selectors';

class HistoricalContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;
    updateFiltersSelected({
      query: { ...query, ...filter },
      section: 'historical-emissions'
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

HistoricalContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

HistoricalContainer.defaultProps = { query: {} };

export default connect(getGHGEmissions, actions)(HistoricalContainer);
