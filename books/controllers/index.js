var fs = require("fs");
var minimatch = require("minimatch");

/** Initialize all controllers */
exports.init = function (router) {
    var files = fs.readdirSync(__dirname);
    files = files.filter(minimatch.filter("!index.js", { matchBase: true }));
    files.forEach(function (val) {
        require("./" + val).init(router);
    });
};