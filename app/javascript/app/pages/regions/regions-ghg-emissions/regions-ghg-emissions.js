import { connect } from 'react-redux';
import React, { PureComponent } from 'react';
import PropTypes from 'prop-types';

import Component from './regions-ghg-emissions-component';
import { getGHGEmissions } from './regions-ghg-emissions-selectors';

import * as actions from './regions-ghg-emissions-actions';

const mapStateToProps = getGHGEmissions;

class RegionsGHGEmissionsContainer extends PureComponent {
  onFilterChange = filter => {
    const { updateFiltersSelected, query, provinceISO } = this.props;

    updateFiltersSelected({
      section: 'regions-ghg-emissions',
      region: provinceISO,
      query: { ...query, ...filter }
    });
  };

  render() {
    return <Component {...this.props} onFilterChange={this.onFilterChange} />;
  }
}

RegionsGHGEmissionsContainer.propTypes = {
  updateFiltersSelected: PropTypes.func.isRequired,
  query: PropTypes.object,
  provinceISO: PropTypes.string
};

RegionsGHGEmissionsContainer.defaultProps = { query: {}, provinceISO: '' };

export default connect(mapStateToProps, actions)(RegionsGHGEmissionsContainer);
