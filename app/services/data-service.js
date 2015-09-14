"use strict";

var deps = ["$injector"];

function serv($injector) {
//https://www.npmjs.com/package/d
    var repos = ["users","books"];
    var service = {};

    function initRepo(name) {
        Object.defineProperty(service, name, {
            configurable: true,
            get: getRepo.bind(null, name)
        });
    }

    repos.forEach(initRepo);

    function getRepo(name) {
        var fullName = "repository." + name.toLowerCase();
        var Repo = $injector.get(fullName);
        return new Repo();
    }

    return service;

}
serv.$inject = deps;
module.exports = function (app) {
    app.factory("dataService", serv);
};