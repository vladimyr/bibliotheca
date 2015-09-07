"use strict";

var deps = ["$rootScope"];
function serv($rootScope) {
    //

    //
};
serv.$inject = deps;
module.exports = function (app) {
    app.factory("authService", serv);
};