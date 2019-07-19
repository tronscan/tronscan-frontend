const path = require('path');
const webpack = require("webpack");
const autoprefixer = require('autoprefixer');
module.exports = {
    entry:{
        react:['react','react-dom',],
        polyfill:['whatwg-fetch'],
        ui: ["antd"],
        base: ["lodash", "moment"],
        charts:["echarts","highcharts"],
    },
    output:{
        path: path.join(__dirname, "../public/dll"),
        filename: "[name].dll.js",
        library: "[name]"
    },
    plugins:[
        new webpack.DllPlugin({
            path: path.join(__dirname, "../mainfest", "[name]-manifest.json"),
            name: "[name]"
        })
    ],
    module: {
        loaders: [
            {
                test: /\.jsx?$/,
                loader: 'babel',
                exclude: /node_modules/,
                query: {
                    cacheDirectory: true,
                    presets: ['react', 'es2015']
                }
            },
            {
                test: /\.css$/,
                use: [
                    require.resolve('style-loader'),
                    {
                        loader: require.resolve('css-loader'),
                        options: {
                            importLoaders: 1,
                        },
                    },
                    {
                        loader: require.resolve('postcss-loader'),
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins: () => [
                                require('postcss-flexbugs-fixes'),
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                    flexbox: 'no-2009',
                                }),
                            ],
                        },
                    },
                ],
            },
        ]
    }
}