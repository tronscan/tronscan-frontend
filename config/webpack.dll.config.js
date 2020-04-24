const webpack = require('webpack')
const library = '[name]_lib'
const path = require('path')

module.exports = {
  entry: {
    vendors: ['react', 'lodash','react-dom','react-router','ethers']
  },

  output: {
    filename: '[name].dll.js',
    path: 'dist/',
    library
  },

  plugins: [
    new webpack.DllPlugin({
      path: path.join(__dirname, 'dist/[name]-manifest.json'),
      // This must match the output.library option above
      name: library
    }),
  ],
}
