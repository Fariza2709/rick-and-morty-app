const HtmlWebpackPlugin = require('html-webpack-plugin');
const VueLoaderPlugin = require('vue-loader').VueLoaderPlugin;
const CopyWebpackPlugin = require('copy-webpack-plugin');
const webpack = require('webpack');
const path = require('path');

module.exports = {
  entry: './src/main.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, 'dist'),
    },
  plugins: [
    new HtmlWebpackPlugin({
      template: 'index.html',
    }),
    new CopyWebpackPlugin({
      patterns: [
        { from: './favicon.ico', to: 'favicon.ico' }
      ],
    }),
    new VueLoaderPlugin(),
    new webpack.DefinePlugin({
      __VUE_OPTIONS_API__: JSON.stringify(true),
      __VUE_PROD_DEVTOOLS__: JSON.stringify(false),
      __VUE_PROD_HYDRATION_MISMATCH_DETAILS__: JSON.stringify(false),
    })
  ],
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.vue$/,
        use: 'vue-loader',
      },
      {
        test: /\.(js|jsx)$/,
        use: 'babel-loader',
        exclude: /node_modules/,
      },
    ],
  },
  stats: {
    errorDetails: true,
    children: true,
  },
};
