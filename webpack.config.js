// webpack.config.js
const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
  entry: {
    background: './src/background.js',
    popup: './src/popup.js',
    content: './src/content.js'
  },
  output: {
    filename: '[name].js',
    path: path.resolve(__dirname, 'dist'),
  },
  mode: 'production',
  watch: true,
  plugins: [
    new CopyWebpackPlugin({
      patterns: [
        { from: 'static'},
      ],
    }),
  ],
  resolve: {
    fallback: {
      path: false, // No polyfill for 'path'
      util: false,
      url: false,
      buffer: false,
      vm: false,
      os: false,
      constants: false,
      stream: false,
      assert: false,
      querystring: false,
      https: false,
      http: false,
      fs: false,
      child_process: false
    },
  },
};
