const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
  entry: {
    vendors: ['react',
    'react-dom',
    'react-router',
    'lodash',
    'google-protobuf',
    'moment'

    ]
  },

  output: {
    filename: '[name].dll.js',
    path: 'dist/',
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/[name]manifest.json'),
      // This must match the output.library option above
      name: library
    }),
  ],
}