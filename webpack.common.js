const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: {
    app: path.resolve(__dirname, 'src/app.js'), // Titik masuk utama aplikasi
  },
  output: {
    filename: '[name].bundle.js', // Nama file output yang dibundel
    path: path.resolve(__dirname, 'dist'), // Direktori output
    clean: true, // Bersihkan direktori dist sebelum setiap build
  },
  resolve: {
    extensions: ['.js'], // Ekstensi file yang akan diselesaikan
  },
  module: {
    rules: [
      {
        test: /\.css$/, // Menguji file CSS
        use: [
          'style-loader', // Menyuntikkan CSS ke DOM
          'css-loader', // Menginterpretasikan @import dan url()
        ],
      },
      {
        test: /\.js$/, // Menguji file JavaScript
        exclude: /node_modules/, // Kecualikan folder node_modules
        use: {
          loader: 'babel-loader', // Gunakan Babel untuk transpiling
          options: {
            presets: ['@babel/preset-env'], // Preset Babel untuk Env
          },
        },
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: path.resolve(__dirname, 'src/index.html'), // Template HTML yang akan digunakan
      filename: 'index.html', // Nama file HTML output
    }),
  ],
};
