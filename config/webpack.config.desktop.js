const paths = require('./paths');
const webpack = require('webpack');

module.exports = {
  target: 'node',
  entry: paths.desktopIndexJs,
  output: {
    path: paths.desktopOutput,
    filename: 'index.js',
  },
  externals: {
    electron: "require('electron')",
  },
  node: {
    __dirname: false
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        include: [
          paths.desktopSrc,
          paths.appSrc,
        ],
        exclude: [
          paths.appNodeModules,
        ],
        use: {
          loader: "babel-loader"
        }
      }
    ]
  },
  plugins: [

  ]
};
