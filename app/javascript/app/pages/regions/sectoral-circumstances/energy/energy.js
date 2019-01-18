import { connect } from 'react-redux';
import Component from './energy-component';
import { getIndicatorsData } from '../sectoral-circumstances-selectors';

// eslint-disable-next-line no-unused-vars
const mapStateToProps = state => {
  const INDICATOR_CODE = 'capacity';
  const getData = getIndicatorsData(INDICATOR_CODE);

  // eslint-disable-next-line no-shadow
  return state => ({
    t: getData(state).t,
    chartData: getData(state).chartData,
    indicatorName: getData(state).indicatorName
  });
};

export default connect(mapStateToProps, null)(Component);
