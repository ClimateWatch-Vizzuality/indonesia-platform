// Note: You must restart bin/webpack-dev-server for changes to take effect

// eslint-disable-next-line
const dotenv = require('dotenv').config();
const path = require('path');
const merge = require('webpack-merge');
const DuplicatePackageCheckerPlugin = require(
  'duplicate-package-checker-webpack-plugin'
);
const sharedConfig = require('./shared.js');
const { settings, output } = require('./configuration.js');

module.exports = merge(sharedConfig, {
  resolve: {
    alias: {
      react: path.resolve('./node_modules/react'),
      'react-dom': path.resolve('./node_modules/react-dom')
    }
  },
  devtool: '#eval-source-map',
  mode: 'development',
  stats: { errorDetails: true },
  output: { pathinfo: true },
  plugins: [ new DuplicatePackageCheckerPlugin() ],
  devServer: {
    clientLogLevel: 'none',
    https: settings.dev_server.https,
    host: settings.dev_server.host,
    port: settings.dev_server.port,
    contentBase: output.path,
    publicPath: output.publicPath,
    compress: true,
    headers: { 'Access-Control-Allow-Origin': '*' },
    historyApiFallback: true,
    watchOptions: { ignored: /node_modules/ }
  }
});
