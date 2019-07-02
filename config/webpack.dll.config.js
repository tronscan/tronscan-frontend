const path = require('path');
const webpack = require("webpack");
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
    ]
}