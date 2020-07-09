const path = require("path");
const webpack = require("webpack");
const HTMLWebpackPlugin = require('html-webpack-plugin');

module.exports = {
  entry: "./src/index.tsx",
  output: {
    filename: '[name].[chunkhash].js',
    chunkFilename: "chunk.[name].[chunkhash].js",
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/,
        enforce: "pre",
        include: path.resolve(__dirname, "../src"),
        loader: "tslint-loader",
        options: {
          typeCheck: false
        }
      },
      {
        test: /\.tsx?$/,
        include: path.resolve(__dirname, "../src"),
        loader: "ts-loader"
      },
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      }
    ]
  },
  resolve: {
    extensions: [".js", ".ts", ".tsx"]
  },
  optimization: {
    splitChunks: {
      chunks: 'all',
      cacheGroups: {
        vendor: {
          test: /[\\/]node_modules[\\/](react|react-dom|react-router-dom|history)[\\/]/,
          name: 'vendor',
          chunks: 'all',
        }        
      }      
    },
    runtimeChunk: {
      name: "manifest",
    }
  },
  plugins: [
    new HTMLWebpackPlugin({
      template: path.resolve(__dirname, 'index.template.html'),
      filename: path.resolve(__dirname, '../index.html')
    }),
    new webpack.HashedModuleIdsPlugin()
  ]
};
