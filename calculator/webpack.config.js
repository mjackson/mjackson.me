const path = require('path')

module.exports = {
  entry: path.resolve(__dirname, 'index.js'),

  output: {
    path: __dirname,
    filename: '[name].js'
  },

  module: {
    loaders: [
      { test: /\.js$/, loader: 'babel' },
      { test: /\.css$/, loader: 'style!css' }
    ]
  }
}
