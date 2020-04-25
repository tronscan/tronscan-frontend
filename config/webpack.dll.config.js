const webpack = require('webpack')
const library = '[name]'
const path = require('path')
const HtmlWebpackPlugin = require('html-webpack-plugin');


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
    filename:  'dll.[name]-[contenthash].js',
    path: 'dist/',
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/[name]manifest.json'),
      // This must match the output.library option above
      name: library
    }),
  //    new HtmlWebpackPlugin({
  //     template: './public/index.html',
  //     r1: './dll.[name]-[contenthash].js',
  //     r2: './dll.[name]-[contenthash].js',
  //     r3: './dll.[name]-[contenthash].js',
  //     r4: './dll.[name]-[contenthash].js',
  //     r5: './dll.[name]-[contenthash].js',
  // })
  
  ],
}