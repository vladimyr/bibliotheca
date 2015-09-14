"use strict";

var deps = ["$http"];

function serv($http) {

    var config = require("../config.js");
    var apiUrl = config.apiUrl + "/users/";

    function getAll() {
        return $http.get(apiUrl)
            .then(function(res){
                return res.data;
            });
    }

    function getById(id) {
        return $http.get(apiUrl + id)
            .then(function(res){
                return res.data;
            });
    }

    function changePass(id, oldPass, newPass) {
        return $http.put(apiUrl + id + "/changePass", {oldPass: oldPass, newPass: newPass});
    }

    function reverseAdmin(id) {
        return $http.get(apiUrl + id + "/reverseAdmin");
    }

    return function Ctor() {
        this.getAll = getAll;
        this.getById = getById;
        this.changePass = changePass;
        this.reverseAdmin = reverseAdmin;
    };

}
serv.$inject = deps;

module.exports = function (app) {
    app.factory("repository.users", serv);
};

