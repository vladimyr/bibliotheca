"use strict";

var path = require("path"),
    ExtractTextPlugin = require("extract-text-webpack-plugin");
var webpack = require("webpack");

module.exports = {
    devtool: "source-map",
    entry: "./app/index.js",
    output: {
        path: path.join(__dirname, "/public/dist"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: ExtractTextPlugin.extract("style-loader", "css-loader")},
            {test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: "file-loader"},
            // ngtemplate - can require all templates from app/views
            //{test: /\.html$/, loader: "ngtemplate?relativeTo=" + (path.resolve(__dirname, "./app/views")) + "/!html"},
            {test: /\.html$/, loader: "html!ngtemplate"},
            // expose jQuery globally
            //{test: require.resolve("jquery"), loader: "expose?jQuery"},
            // if using require("bootstrap/dist/js/bootstrap.js")
            //{test: /bootstrap\.js$/, loader: "imports?jQuery=jquery" },
            {test: /bootstrap(\\|\/)js(\\|\/).*\.js$/, loader: "imports?jQuery=jquery"}
        ]
    },
    plugins: [
        //new webpack.ProvidePlugin({
        //    "angular": "angular"
        //}),
        new ExtractTextPlugin("style.css", {allChunks: true})
    ]
};
console.log(path.resolve(__dirname, './app/views'));