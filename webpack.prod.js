/* eslint-disable */
const path = require('path');
const common = require('./webpack.common');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractWebpackPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const TerserWebpackPlugin = require('terser-webpack-plugin');
const {merge} = require('webpack-merge');
const {CleanWebpackPlugin} = require('clean-webpack-plugin');

module.exports = merge(common, {
  mode: 'production',
  output: {
    path: path.resolve(__dirname, './static'),
    filename: '[name].[contenthash].bundle.js',
  },
  optimization: {
    emitOnErrors: false,
    minimize: true,
    minimizer: [new CssMinimizerPlugin(), new TerserWebpackPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.(s)?css$/,
        exclude: /node-modules/,
        use: [
          MiniCssExtractWebpackPlugin.loader,
          'css-loader',
          'postcss-loader',
          'sass-loader',
        ],
      },
    ],
  },
  plugins: [
    // new webpack.DefinePlugin({
    //   'process.env': {NODE_ENV: JSON.stringify('production')},
    // }),
    new webpack.DefinePlugin({
      'process.env': JSON.stringify(
        dotenv.config({path: path.resolve(process.cwd(), '.env.prod')}).parsed,
      ),
    }),
    new HtmlWebpackPlugin({
      template: './templates/frontend/template.html',
      filename: '../templates/frontend/index.html',
      // TODO: was doing by default
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CleanWebpackPlugin(),
    new MiniCssExtractWebpackPlugin({filename: '[name].[contenthash].css'}),
  ],
  optimization: {
    minimize: true,
  },
});
