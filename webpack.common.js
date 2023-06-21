/* eslint-disable */
// TODO: check if thi is needed
const ForkTsCheckerNotifierWebpackPlugin = require('fork-ts-checker-notifier-webpack-plugin');
const ForkTsCheckerWebpackPlugin = require('fork-ts-checker-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');

module.exports = {
  entry: {
    main: './src/index.tsx',
    // TODO: no vendor yet (maybe do this with utils?)
    // vendor: './src/vendor.js'
  },
  resolve: {
    extensions: ['.ts', '.js', '.tsx', '.json'],
  },
  module: {
    rules: [
      {
        test: /\.(js|ts)(x)?$/,
        exclude: /node-modules/,
        use: {loader: 'ts-loader', options: {transpileOnly: true}},
      },
      {
        test: /\.html$/,
        use: ['html-loader'],
      },
      {
        test: /^((?!\.sprite).)*\.(svg|png|gif)$/,
        use: {
          loader: 'file-loader',
          // TODO: haven't checked if this works + compression can be setup
          options: {name: '[name].[hash].[ext]', outputPath: 'imgs'},
        },
      },
      {
        test: /\.sprite\.svg$/,
        use: {
          loader: 'svg-sprite-loader',
          // TODO: haven't checked if this works + compression can be setup
          options: {name: '[name].[hash].[ext]', outputPath: 'imgs'},
        },
      },
    ],
  },

  plugins: [
    new ForkTsCheckerWebpackPlugin({
      eslint: {files: './src/**/*.{ts,tsx,js,jsx}'},
    }),
    new ForkTsCheckerNotifierWebpackPlugin({
      title: 'TypeScript',
      excludeWarnings: false,
    }),
  ],
  //  optimization: {
  //   minimize: true,
  // },
  // plugins: [
  //   new ESLintPlugin({
  //     extensions: ['ts', 'tsx'],
  //     // Uncomment if you are a hardcore boychick
  //     //  failOnError: true
  //   }),
  // ],
};
