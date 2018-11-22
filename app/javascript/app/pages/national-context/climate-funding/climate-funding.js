import { connect } from 'react-redux';
import Component from './climate-funding-component';

const mapStateToProps = ({ FundingOportunities }) => ({
  data: FundingOportunities.data
});

export default connect(mapStateToProps)(Component);
