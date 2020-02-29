"use strict";

var _interopRequireWildcard = require("@babel/runtime/helpers/interopRequireWildcard");

var _interopRequireDefault = require("@babel/runtime/helpers/interopRequireDefault");

Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.default = getBaseWebpackConfig;

var _stringify = _interopRequireDefault(require("@babel/runtime/core-js/json/stringify"));

var _toConsumableArray2 = _interopRequireDefault(require("@babel/runtime/helpers/toConsumableArray"));

var _regenerator = _interopRequireDefault(require("@babel/runtime/regenerator"));

var _objectSpread2 = _interopRequireDefault(require("@babel/runtime/helpers/objectSpread"));

var _keys = _interopRequireDefault(require("@babel/runtime/core-js/object/keys"));

var _asyncToGenerator2 = _interopRequireDefault(require("@babel/runtime/helpers/asyncToGenerator"));

var _path = _interopRequireWildcard(require("path"));

var _webpack = _interopRequireDefault(require("webpack"));

var _resolve = _interopRequireDefault(require("resolve"));

var _uglifyjsWebpackPlugin = _interopRequireDefault(require("uglifyjs-webpack-plugin"));

var _caseSensitivePathsWebpackPlugin = _interopRequireDefault(require("case-sensitive-paths-webpack-plugin"));

var _writeFileWebpackPlugin = _interopRequireDefault(require("write-file-webpack-plugin"));

var _friendlyErrorsWebpackPlugin = _interopRequireDefault(require("friendly-errors-webpack-plugin"));

var _utils = require("./webpack/utils");

var _pagesPlugin = _interopRequireDefault(require("./webpack/plugins/pages-plugin"));

var _nextjsSsrImport = _interopRequireDefault(require("./webpack/plugins/nextjs-ssr-import"));

var _dynamicChunksPlugin = _interopRequireDefault(require("./webpack/plugins/dynamic-chunks-plugin"));

var _unlinkFilePlugin = _interopRequireDefault(require("./webpack/plugins/unlink-file-plugin"));

var _pagesManifestPlugin = _interopRequireDefault(require("./webpack/plugins/pages-manifest-plugin"));

var _buildManifestPlugin = _interopRequireDefault(require("./webpack/plugins/build-manifest-plugin"));

var _constants = require("../lib/constants");

function externalsConfig(dir, isServer) {
  var externals = [];

  if (!isServer) {
    return externals;
  }

  externals.push(function (context, request, callback) {
    (0, _resolve.default)(request, {
      basedir: dir,
      preserveSymlinks: true
    }, function (err, res) {
      if (err) {
        return callback();
      } // Default pages have to be transpiled


      if (res.match(/node_modules[/\\]next[/\\]dist[/\\]pages/)) {
        return callback();
      } // Webpack itself has to be compiled because it doesn't always use module relative paths


      if (res.match(/node_modules[/\\]webpack/)) {
        return callback();
      }

      if (res.match(/node_modules[/\\].*\.js$/)) {
        return callback(null, "commonjs ".concat(request));
      }

      callback();
    });
  });
  return externals;
}

function getBaseWebpackConfig(_x, _x2) {
  return _getBaseWebpackConfig.apply(this, arguments);
}

function _getBaseWebpackConfig() {
  _getBaseWebpackConfig = (0, _asyncToGenerator2.default)(
  /*#__PURE__*/
  _regenerator.default.mark(function _callee2(dir, _ref) {
    var _ref$dev, dev, _ref$isServer, isServer, buildId, config, defaultLoaders, nodePathList, pagesEntries, totalPages, clientEntries, webpackConfig;

    return _regenerator.default.wrap(function _callee2$(_context2) {
      while (1) {
        switch (_context2.prev = _context2.next) {
          case 0:
            _ref$dev = _ref.dev, dev = _ref$dev === void 0 ? false : _ref$dev, _ref$isServer = _ref.isServer, isServer = _ref$isServer === void 0 ? false : _ref$isServer, buildId = _ref.buildId, config = _ref.config;
            defaultLoaders = {
              babel: {
                loader: 'next-babel-loader',
                options: {
                  dev: dev,
                  isServer: isServer
                }
              },
              hotSelfAccept: {
                loader: 'hot-self-accept-loader',
                options: {
                  include: [_path.default.join(dir, 'pages')],
                  // All pages are javascript files. So we apply hot-self-accept-loader here to facilitate hot reloading of pages.
                  // This makes sure plugins just have to implement `pageExtensions` instead of also implementing the loader
                  extensions: new RegExp("\\.+(".concat(config.pageExtensions.join('|'), ")$"))
                }
              } // Support for NODE_PATH

            };
            nodePathList = (process.env.NODE_PATH || '').split(process.platform === 'win32' ? ';' : ':').filter(function (p) {
              return !!p;
            });
            _context2.next = 5;
            return (0, _utils.getPages)(dir, {
              nextPagesDir: _constants.DEFAULT_PAGES_DIR,
              dev: dev,
              isServer: isServer,
              pageExtensions: config.pageExtensions.join('|')
            });

          case 5:
            pagesEntries = _context2.sent;
            totalPages = (0, _keys.default)(pagesEntries).length;
            clientEntries = !isServer ? {
              'main.js': [dev && !isServer && _path.default.join(_constants.NEXT_PROJECT_ROOT_DIST, 'client', 'webpack-hot-middleware-client'), dev && !isServer && _path.default.join(_constants.NEXT_PROJECT_ROOT_DIST, 'client', 'on-demand-entries-client'), _path.default.join(_constants.NEXT_PROJECT_ROOT_DIST, 'client', dev ? "next-dev" : 'next')].filter(Boolean)
            } : {};
            webpackConfig = {
              devtool: dev ? 'cheap-module-source-map' : false,
              name: isServer ? 'server' : 'client',
              cache: true,
              target: isServer ? 'node' : 'web',
              externals: externalsConfig(dir, isServer),
              context: dir,
              // Kept as function to be backwards compatible
              entry: function () {
                var _entry = (0, _asyncToGenerator2.default)(
                /*#__PURE__*/
                _regenerator.default.mark(function _callee() {
                  return _regenerator.default.wrap(function _callee$(_context) {
                    while (1) {
                      switch (_context.prev = _context.next) {
                        case 0:
                          return _context.abrupt("return", (0, _objectSpread2.default)({}, clientEntries, pagesEntries));

                        case 1:
                        case "end":
                          return _context.stop();
                      }
                    }
                  }, _callee, this);
                }));

                return function entry() {
                  return _entry.apply(this, arguments);
                };
              }(),
              output: {
                path: _path.default.join(dir, config.distDir, isServer ? _constants.SERVER_DIRECTORY : ''),
                filename: '[name]',
                libraryTarget: 'commonjs2',
                // This saves chunks with the name given via require.ensure()
                chunkFilename: dev ? '[name].js' : '[name]-[chunkhash].js',
                strictModuleExceptionHandling: true
              },
              performance: {
                hints: false
              },
              resolve: {
                extensions: ['.js', '.jsx', '.json'],
                modules: [_constants.NEXT_PROJECT_ROOT_NODE_MODULES, 'node_modules'].concat((0, _toConsumableArray2.default)(nodePathList)),
                alias: {
                  next: _constants.NEXT_PROJECT_ROOT
                }
              },
              resolveLoader: {
                modules: [_constants.NEXT_PROJECT_ROOT_NODE_MODULES, 'node_modules', _path.default.join(__dirname, 'webpack', 'loaders')].concat((0, _toConsumableArray2.default)(nodePathList))
              },
              module: {
                rules: [dev && !isServer && {
                  test: defaultLoaders.hotSelfAccept.options.extensions,
                  include: defaultLoaders.hotSelfAccept.options.include,
                  use: defaultLoaders.hotSelfAccept
                }, {
                  test: /\.(js|jsx)$/,
                  include: [dir],
                  exclude: /node_modules/,
                  use: defaultLoaders.babel
                }].filter(Boolean)
              },
              plugins: [new _webpack.default.IgnorePlugin(/(precomputed)/, /node_modules.+(elliptic)/), dev && new _webpack.default.NoEmitOnErrorsPlugin(), dev && !isServer && new _friendlyErrorsWebpackPlugin.default(), dev && new _webpack.default.NamedModulesPlugin(), dev && !isServer && new _webpack.default.HotModuleReplacementPlugin(), // Hot module replacement
              dev && new _unlinkFilePlugin.default(), dev && new _caseSensitivePathsWebpackPlugin.default(), // Since on macOS the filesystem is case-insensitive this will make sure your path are case-sensitive
              dev && new _writeFileWebpackPlugin.default({
                exitOnErrors: false,
                log: false,
                // required not to cache removed files
                useHashIndex: false
              }), !isServer && !dev && new _uglifyjsWebpackPlugin.default({
                parallel: true,
                sourceMap: false,
                uglifyOptions: {
                  mangle: {
                    safari10: true
                  }
                }
              }), new _webpack.default.DefinePlugin({
                'process.env.NODE_ENV': (0, _stringify.default)(dev ? 'development' : 'production')
              }), !dev && new _webpack.default.optimize.ModuleConcatenationPlugin(), isServer && new _pagesManifestPlugin.default(), !isServer && new _buildManifestPlugin.default(), !isServer && new _pagesPlugin.default(), !isServer && new _dynamicChunksPlugin.default(), isServer && new _nextjsSsrImport.default(), // In dev mode, we don't move anything to the commons bundle.
              // In production we move common modules into the existing main.js bundle
              !isServer && new _webpack.default.optimize.CommonsChunkPlugin({
                name: 'main.js',
                filename: dev ? 'static/commons/main.js' : 'static/commons/main-[chunkhash].js',
                minChunks: function minChunks(module, count) {
                  // React and React DOM are used everywhere in Next.js. So they should always be common. Even in development mode, to speed up compilation.
                  if (module.resource && module.resource.includes("".concat(_path.sep, "react-dom").concat(_path.sep)) && count >= 0) {
                    return true;
                  }

                  if (module.resource && module.resource.includes("".concat(_path.sep, "react").concat(_path.sep)) && count >= 0) {
                    return true;
                  } // In the dev we use on-demand-entries.
                  // So, it makes no sense to use commonChunks based on the minChunks count.
                  // Instead, we move all the code in node_modules into each of the pages.


                  if (dev) {
                    return false;
                  } // Check if the module is used in the _app.js bundle
                  // Because _app.js is used on every page we don't want to
                  // duplicate them in other bundles.


                  var chunks = module.getChunks();

                  var appBundlePath = _path.default.normalize('bundles/pages/_app.js');

                  var inAppBundle = chunks.some(function (chunk) {
                    return chunk.entryModule ? chunk.entryModule.name === appBundlePath : null;
                  });

                  if (inAppBundle && chunks.length > 1) {
                    return true;
                  } // If there are one or two pages, only move modules to common if they are
                  // used in all of the pages. Otherwise, move modules used in at-least
                  // 1/2 of the total pages into commons.


                  if (totalPages <= 2) {
                    return count >= totalPages;
                  }

                  return count >= totalPages * 0.5;
                }
              }), // We use a manifest file in development to speed up HMR
              dev && !isServer && new _webpack.default.optimize.CommonsChunkPlugin({
                name: 'manifest.js',
                filename: dev ? 'static/commons/manifest.js' : 'static/commons/manifest-[chunkhash].js'
              })].filter(Boolean)
            };

            if (typeof config.webpack === 'function') {
              webpackConfig = config.webpack(webpackConfig, {
                dir: dir,
                dev: dev,
                isServer: isServer,
                buildId: buildId,
                config: config,
                defaultLoaders: defaultLoaders,
                totalPages: totalPages
              });
            }

            return _context2.abrupt("return", webpackConfig);

          case 11:
          case "end":
            return _context2.stop();
        }
      }
    }, _callee2, this);
  }));
  return _getBaseWebpackConfig.apply(this, arguments);
}