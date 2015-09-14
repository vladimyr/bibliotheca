"use strict";

var deps = ["$injector", "$q"];

function serv($injector, $q) {

    var request = function (config) {
        var authService = $injector.get("authService");
        if (authService.getUser())
            config.headers["Authorization"] = "bearer " + authService.getUser().token;
        return config;
    };

    var responseError = function (response) {
        var authService = $injector.get("authService");
        if (response.status == 401) {
            authService.clearUser();
        }
        return $q.reject(response);
    };

    return {
        request: request,
        responseError: responseError
    };

}
serv.$inject = deps;

module.exports = function (app) {
    app.factory("authInterceptor", serv);
};

