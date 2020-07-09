const path = require("path");
const {merge} = require('webpack-merge');

const publicPath = '/dist/dev/';

module.exports = merge(require('./webpack.config.common'), {
  output: {
    path: path.resolve(__dirname, `..${publicPath}`),
    publicPath
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: "pre",
        include: path.resolve(__dirname, "../src"),
        use: "source-map-loader"
      },
    ]
  },
  devtool: "inline-source-map",
  mode: "development"
});
