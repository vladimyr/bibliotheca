var path = require("path");
module.exports = {
    entry: "./webpack.entry.js",
    output: {
        path: path.join(__dirname, "/public"),
        filename: "bundle.js"
    },
    module: {
        loaders: [
            {test: /\.css$/, loader: "style!css"},
            {test: /\.(eot|woff|woff2|ttf|svg|png|jpg)$/, loader: "file-loader"},
            {test: /bootstrap\.js$/, loader: 'imports?jQuery=jquery'}
        ]
    }
};