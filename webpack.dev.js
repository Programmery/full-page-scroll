/* eslint-disable */
const path = require('path');
const webpack = require('webpack');
const dotenv = require('dotenv');
const {merge} = require('webpack-merge');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const common = require('./webpack.common');

module.exports = merge(common, {
  mode: 'development',
  output: {
    path: path.resolve(__dirname, './dist'),
    filename: '[name].bundle.js',
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        exclude: /node-modules/,
        use: ['style-loader', 'css-loader', 'postcss-loader', 'sass-loader'],
      },
    ],
  },
  plugins: [
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({path: path.resolve(process.cwd(), '.env.dev')}).parsed,
      ),
    }),
    // TODO: maybe splitting this is a bad idea (but its for webpack-dev-server)
    new HtmlWebpackPlugin({
      template: './templates/frontend/template.html',
      // filename: '../templates/frontend/index.html',
    }),
    new webpack.HotModuleReplacementPlugin(),
  ],
});
