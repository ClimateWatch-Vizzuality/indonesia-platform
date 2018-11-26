import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { getPopulation } from './population-selectors';
import * as actions from './population-actions';

import Component from './population-component';

const mapStateToProps = getPopulation;

class PopulationContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query } = this.props;

    updateFiltersSelected({ query: { ...query, ...filter } });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

PopulationContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object
};

PopulationContainer.defaultProps = { query: {} };

export default connect(mapStateToProps, actions)(PopulationContainer);
