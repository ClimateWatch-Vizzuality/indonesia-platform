import { PureComponent, createElement } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import actions from './ndcs-country-accordion-actions';
import reducers, { initialState } from './ndcs-country-accordion-reducers';

import NdcsCountryAccordionComponent from './ndcs-country-accordion-component';
import {
  filterNDCs,
  filterSectoralNDCs
} from './ndcs-country-accordion-selectors';

const { COUNTRY_ISO } = process.env;

const mapStateToProps = (state, { category }) => {
  const { data, loading } = state.ndcCountryAccordion;
  const ndcsData = { data, search: {}, countries: COUNTRY_ISO };
  return {
    loading,
    ndcsData: category === 'sectoral_information'
      ? filterSectoralNDCs(ndcsData)
      : filterNDCs(ndcsData),
    search: {},
    iso: COUNTRY_ISO
  };
};

class NdcsCountryAccordionContainer extends PureComponent {
  componentWillMount() {
    const { fetchNdcsCountryAccordion, category } = this.props;
    const locations = COUNTRY_ISO;
    fetchNdcsCountryAccordion({ locations, category });
  }

  render() {
    return createElement(NdcsCountryAccordionComponent, { ...this.props });
  }
}

NdcsCountryAccordionContainer.propTypes = {
  fetchNdcsCountryAccordion: PropTypes.func.isRequired,
  category: PropTypes.string
};

NdcsCountryAccordionContainer.defaultProps = { category: undefined };

export const reduxModule = { actions, reducers, initialState };
export default connect(mapStateToProps, actions)(NdcsCountryAccordionContainer);
