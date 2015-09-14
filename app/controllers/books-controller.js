"use strict";

var deps = ["$scope", "dataService", "authService", "$state"];

function ctrl($scope, dataService, authService, $state) {
    //

    var isUser = $state.current.data.isUser;
    $scope.user = authService.getUser();
    $scope.currentPage = 1;
    $scope.bookCount = 0;
    var perPage = 8;

    function getBooksPromise() {
        if (isUser)
            return dataService.users.getById($scope.user._id)
                .then(function (data) {
                    return data.books;
                })
                .then(function (ids) {
                    var books = [];
                    ids.forEach(function (id) {
                        dataService.books.getById(id)
                            .then(function (book) {
                                books.push(book);
                            });
                    });
                    return books;
                });
        else
            return dataService.books.getAll($scope.currentPage, perPage)
                .then(function (data) {
                    return data;
                });
    };

    $scope.getBooks = function (page) {
        dataService.books.getAllCount()
            .then(function (data) {
                $scope.bookCount = data;
                $scope.maxPage = Math.ceil($scope.bookCount / perPage);
                if (page > $scope.maxPage)
                    $scope.currentPage = $scope.maxPage;
                else
                    $scope.currentPage = page;

                return getBooksPromise();
            })
            .then(function (books) {
                $scope.books = books;
                $scope.books.forEach(function (val) {
                    dataService.books.isLiked(val._id);
                });

            });
    };
    $scope.getBooks($scope.currentPage);

    $scope.reverseLike = function (book) {
        dataService.books.reverseLike(book._id);
    };

    $scope.openModal = function (book) {
        $scope.bookInstance = book;
        $scope.showModal = true;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("BooksController", ctrl);
};
