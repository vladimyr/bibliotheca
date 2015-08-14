var fs = require("fs");
var minimatch = require("minimatch");

exports.init = function (router) {
    var files = fs.readdirSync(__dirname);
    files = files.filter(minimatch.filter("!index.js", { matchBase: true }));
    files.forEach(function (val) {
        require("./" + val).init(router);
    });
    //fs.readdir(__dirname, function (err, files) {
    //    files = files.filter(minimatch.filter("!index.js", { matchBase: true }));
    //    files.forEach(function (val) {
    //        require("./" + val).init(router);
    //    });
    //});
};