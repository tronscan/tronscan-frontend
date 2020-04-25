const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
  entry: {
    r1: ['react',
    'react-dom',
    ],
    r2: [
    'react-router',
    'lodash',

    ],
    r3: [
    'google-protobuf',
    'moment'
    ],
    r4: [
        'ethers'
        ],
    r5: [
        'tronweb'
        ],

  },

  output: {
    filename:  'dll.[name].js',
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