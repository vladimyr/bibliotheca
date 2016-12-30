"use strict";

var deps = ["$http", "Pool", "User"];

function serv($http, Pool, User) {

    var apiUrl = "/api/users/";

    var _pool = new Pool(User);

    function getAll(page, perPage) {
        return $http.get(apiUrl, {params: {page: page, perPage: perPage}})
            .then(function (res) {
                var models = [];
                res.data.forEach(function (val) {
                    models.push(_pool.updateInstance(val._id, val));
                });
                return models;
            });
    }

    function getCount() {
        return $http.get(apiUrl, {params: {count: true}})
            .then(function (res) {
                return res.data;
            });
    }

    function getById(id) {
        return $http.get(apiUrl + id)
            .then(function (res) {
                return _pool.updateInstance(res.data._id, res.data);
            });
    }

    function getNewPass(email) {
        return $http.get(apiUrl + email + "/changePass");
    }

    function changePass(id, oldPass, newPass) {
        return $http.put(apiUrl + id + "/changePass", {oldPass: oldPass, newPass: newPass});
    }

    function reverseAdmin(id) {
        return $http.get(apiUrl + id + "/reverseAdmin")
            .then(function (res) {
                getById(id);
            });
    }

    return function Ctor() {
        this.getAll = getAll;
        this.getCount = getCount;
        this.getById = getById;
        this.getNewPass = getNewPass;
        this.changePass = changePass;
        this.reverseAdmin = reverseAdmin;
    };

}
serv.$inject = deps;

module.exports = function (app) {
    app.factory("repository.users", serv);
};

