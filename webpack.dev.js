const { merge } = require('webpack-merge');
const common = require('./webpack.common.js');

module.exports = merge(common, {
  mode: 'development', // Mode pengembangan
  devtool: 'inline-source-map', // Peta sumber untuk debugging
  devServer: {
    static: './dist', // Direktori konten statis
    open: true, // Buka browser setelah server dimulai
    hot: true, // Aktifkan Hot Module Replacement
    port: 9000, // Port server pengembangan
  },
});
