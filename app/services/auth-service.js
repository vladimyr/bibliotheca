"use strict";

var deps = ["$rootScope", "$http", "$q", "$state"];

function serv($rootScope, $http, $q, $state) {
    //
    var config = require("../config.js");
    var apiUrl = config.apiUrl;

    function broadcastUserChanged() {
        $rootScope.$broadcast("userChanged");
    };

    function addUserLocal(userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        broadcastUserChanged();
    }

    function addUserSession(userData) {
        sessionStorage.setItem("user", JSON.stringify(userData));
        broadcastUserChanged();
    };

    function login(email, password, remember) {
        var deferred = $q.defer();
        $http.post(apiUrl + "/login", {email: email, password: password})
            .then(function (res) {
                if (res.data) {
                    if (remember)
                        addUserLocal(res.data);
                    else
                        addUserSession(res.data);
                    deferred.resolve(res);
                }
                else
                    deferred.reject();
            }, function (res) {
                deferred.reject(res);
            });
        return deferred.promise;
    }

    function register(email, password) {
        var deferred = $q.defer();
        $http.post(apiUrl + "/register", {email: email, password: password})
            .then(function (res) {
                deferred.resolve(res);
            }, function (res) {
                deferred.reject();
            });
        return deferred.promise;
    }

    function getUser() {
        if (sessionStorage.getItem("user"))
            return JSON.parse(sessionStorage.getItem("user"));
        if (localStorage.getItem("user"))
            return JSON.parse(localStorage.getItem("user"));
    }

    function clearUser() {
        localStorage.removeItem("user");
        sessionStorage.removeItem("user");
        broadcastUserChanged();
        $state.go("login");
    }

    return {
        login: login,
        register: register,
        getUser: getUser,
        clearUser: clearUser
    };
    //
}
serv.$inject = deps;
module.exports = function (app) {
    app.factory("authService", serv);
};