module.exports = {
  test: /\.svg$/,
  use: [ { loader: 'svg-sprite-loader' }, { loader: 'svgo-loader' } ]
};
