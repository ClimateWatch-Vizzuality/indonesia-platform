import 'babel-polyfill';
import 'whatwg-fetch';

import React from 'react';
import PropTypes from 'prop-types';
import { Provider } from 'react-redux';

import store from 'app/store';
import Root from './layouts/root';

// using try catch to get warning if module not found
// module will not be found if cw-components linked locally using yarn link
// but we don't have to import in this case
try {
  // eslint-disable-next-line global-require
  require('cw-components/dist/main');
} catch (err) {
  console.warn('cw-components/dist/main not found');
}

const App = ({ data }) => (
  <Provider store={store(data)}>
    <Root />
  </Provider>
);

App.propTypes = { data: PropTypes.object };

App.defaultProps = { data: {} };

export default App;
