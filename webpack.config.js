"use strict";

var path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");

var apiServerPort = require('./config').port;

module.exports = {
    devtool: "source-map",
    entry: "./app/index.js",
    output: {
        path: path.join(__dirname, "/public/dist"),
        publicPath: "/dist/",
        filename: "bundle.js"
    },
    module: {
        preLoaders: [
            { test: /\.js$/, loader: "buble"  }
        ],
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(eot|woff|woff2|ttf|svg|jpg)$/, loader: "file-loader"},
            {test: /\.png$/, loader: "url-loader"},
            {test: /\.html$/, loader: "html"},
            // expose jQuery globally
            //{test: require.resolve("jquery"), loader: "expose?jQuery"},
            // if using require("bootstrap/dist/js/bootstrap.js")
            //{test: /bootstrap\.js$/, loader: "imports?jQuery=jquery" },
            {test: /bootstrap(\\|\/)js(\\|\/).*\.js$/, loader: "imports?jQuery=jquery"},
            {test: /semantic(\\|\/)dist(\\|\/).*\.js$/, loader: "imports?jQuery=jquery"}
        ]
    },
    devServer: {
        proxy: {
            '/api': {
                target: { host: "localhost", port: apiServerPort },
                secure: false
            }
        }
    },
    plugins: [
        new ExtractTextPlugin("style.css", {allChunks: true})
    ]
};
