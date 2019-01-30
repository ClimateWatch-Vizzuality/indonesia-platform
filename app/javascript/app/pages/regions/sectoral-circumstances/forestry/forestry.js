import { connect } from 'react-redux';
import Component from './forestry-component';
import { getIndicatorsData } from '../sectoral-circumstances-selectors';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => {
  const INDICATOR_CODE = 'forest_cover_loss';
  const getData = getIndicatorsData(INDICATOR_CODE);

  // eslint-disable-next-line no-shadow
  return state => ({
    t: getData(state).t,
    chartData: getData(state).chartData,
    indicatorName: getData(state).indicatorName,
    sources: getData(state).sources
  });
};

export default connect(mapStateToProps, null)(Component);
