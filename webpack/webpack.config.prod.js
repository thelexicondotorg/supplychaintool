const path = require("path");
const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

const publicPath = '/dist/prod/';

module.exports = merge(require('./webpack.config.common'), {
  output: {
    path: path.resolve(__dirname, `..${publicPath}`),
    publicPath
  },
  mode: "production",
  optimization: {
    minimizer: [
      new TerserPlugin({
        parallel: true
      })
    ]
  }
});
