'use strict';

var path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

module.exports = {
    entry: "./webpack.entry.js",
    output: {
        path: path.join(__dirname, "/public"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            { test: /\.css$/, loader: ExtractTextPlugin.extract('style-loader', 'css-loader') },
            { test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: 'file-loader' },

            // bootstrap
            { test: /bootstrap\.js$/, loader: 'imports?jQuery=jquery' },
            { test: /bootstrap\/js\/.*\.js$/, loader: 'imports?jQuery=jquery' }
        ]
    },
    plugins: [
       new ExtractTextPlugin('style.css', { allChunks: true })
    ]
};