const path = require('path')
const autoprefixer = require('autoprefixer')
const HTMLWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  entry: {
    calculator: path.resolve(__dirname, 'pages/calculator')
  },

  output: {
    path: __dirname,
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
    new HTMLWebpackPlugin({
      filename: 'calculator/index.html',
      template: 'pages/calculator/index.html',
      chunks: [ 'calculator' ],
      inject: true,
      hash: true
    })
  ]
}
