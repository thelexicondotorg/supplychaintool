const path = require("path");
const {merge} = require('webpack-merge');
const TerserPlugin = require('terser-webpack-plugin');

module.exports = merge(require('./webpack.config.common'), {
  output: {
    path: path.resolve(__dirname, "../dist/prod"),
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
