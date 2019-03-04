import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { updateQueryParams } from 'utils';
import Component from './historical-emissions-component';
import * as actions from './historical-emissions-actions';
import {
  getGHGEmissions
} from './historical-emissions-selectors/historical-emissions-selectors';

class HistoricalContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;

    if (filter.source) {
      Object.assign(filter, { gas: null, region: null, sector: null });
    }

    updateFiltersSelected({
      section: 'historical-emissions',
      query: updateQueryParams(query, filter)
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
