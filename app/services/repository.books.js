"use strict";

var deps = ["$http"];

function serv($http) {
    var config = require("../config.js");
    var apiUrl = config.apiUrl + "/books/";

    function getAll() {
        return $http.get(apiUrl);
    }

    function getById(id) {
        return $http.get(apiUrl + id);
    }

    function insert(book) {
        return $http.post(apiUrl, book);
    }

    function update(id, book) {
        return $http.put(apiUrl + id, book);
    }

    function remove(id) {
        return $http.delete(apiUrl + id);
    }

    function isLiked(id) {
        return $http.get(apiUrl + id + "/like");
    }

    function reverseLike(id) {
        return $http.put(apiUrl + id + "/like");
    }

    return function Ctor() {
        this.getAll = getAll;
        this.getById = getById;
        this.insert = insert;
        this.update = update;
        this.remove = remove;
        this.isLiked = isLiked;
        this.reverseLike = reverseLike;
    };

};
serv.$inject = deps;

module.exports = function (app) {
    app.factory("repository.books", serv);
};

