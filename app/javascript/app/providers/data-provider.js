import { PureComponent } from 'react';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

class DataProvider extends PureComponent {
  componentDidMount() {
    const { fetchData, params } = this.props;
    fetchData(params);
  }

  componentDidUpdate(prevProps) {
    const { fetchData, params } = this.props;
    const { params: prevParams } = prevProps;

    if (!isEqual(prevParams, params)) fetchData(params);
  }

  render() {
    return null;
  }
}

DataProvider.propTypes = {
  fetchData: PropTypes.func.isRequired,
  params: PropTypes.object
};

DataProvider.defaultProps = { params: {} };

export default DataProvider;
