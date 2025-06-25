const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'production', // Mode produksi
  devtool: 'source-map', // Peta sumber untuk produksi
  optimization: {
    minimize: true, // Minimalkan output
  },
});
