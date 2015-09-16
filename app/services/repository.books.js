"use strict";

var deps = ["$http", "Pool", "Book"];

function serv($http, Pool, Book) {

    var config = require("../config.js");
    var apiUrl = config.apiUrl + "/books/";

    var _pool = new Pool(Book);

    function getAll(page, perPage, userId, sortByLikes) {
        return $http.get(apiUrl, {params: {page: page, perPage: perPage, sortByLikes: sortByLikes, user: userId}})
            .then(function (res) {
                var models = [];
                res.data.forEach(function (val) {
                    models.push(_pool.updateInstance(val._id, val));
                });
                return models;
            });
    }

    function getCount(userId) {
        return $http.get(apiUrl, {params: {count: true, user: userId}})
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

    function insert(book) {
        return $http.post(apiUrl, book)
            .then(function (res) {
                return res.data;
            });
    }

    function update(id, book) {
        return $http.put(apiUrl + id, book)
            .then(function(res){
                return res.data;
            });
    }

    function remove(id) {
        return $http.delete(apiUrl + id);
    }

    function isLiked(id) {
        var book = _pool.getInstance(id);
        return $http.get(apiUrl + id + "/like")
            .then(function (res) {
                book.isLiked = res.data;
                return book.isLiked;
            });
    }

    function reverseLike(id) {
        var book = _pool.getInstance(id);
        return $http.put(apiUrl + id + "/like")
            .then(function (res) {
                if (book.isLiked)
                    book.likeNumber--;
                else
                    book.likeNumber++;
                book.isLiked = !book.isLiked;
            });
    }

    return function Ctor() {
        this.getAll = getAll;
        this.getCount = getCount;
        this.getById = getById;
        this.insert = insert;
        this.update = update;
        this.remove = remove;
        this.isLiked = isLiked;
        this.reverseLike = reverseLike;
    };

}
serv.$inject = deps;

module.exports = function (app) {
    app.factory("repository.books", serv);
};

