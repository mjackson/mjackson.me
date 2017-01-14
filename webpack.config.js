const path = require('path')
const autoprefixer = require('autoprefixer')
const HTMLWebpackPlugin = require('html-webpack-plugin')
const webpack = require('webpack')

module.exports = {
  entry: {
    main: path.resolve(__dirname, 'pages/main'),
    calculator: path.resolve(__dirname, 'pages/calculator')
  },

  output: {
    path: path.resolve(__dirname, 'build'),
    filename: '[name]/bundle.js'
  },

  module: {
    loaders: [
      { test: /\.js$/, exclude: /node_modules/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css!postcss' }
    ]
  },

  postcss: () => [ autoprefixer ],

  plugins: [
    new webpack.DefinePlugin({
      'process.env.NODE_ENV': JSON.stringify('production')
    }),
    new HTMLWebpackPlugin({
      title: 'mjackson',
      filename: 'index.html',
      chunks: [ 'main' ],
      inject: true,
      hash: true
    }),
    new HTMLWebpackPlugin({
      filename: 'calculator/index.html',
      template: 'pages/calculator/index.html',
      chunks: [ 'calculator' ],
      inject: true,
      hash: true
    })
  ]
}
