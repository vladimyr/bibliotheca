"use strict";

var deps = ["$scope", "dataService", "authService", "$state"];

function ctrl($scope, dataService, authService, $state) {
    //

    var isUser = $state.current.data.isUser;
    $scope.user = authService.getUser();
    $scope.currentPage = 1;
    $scope.bookCount = 0;
    var perPage = 4;

    $scope.getBooks = function (page) {
        var userId;
        if (isUser)
            userId = $scope.user._id;
        else
            userId = null;
        dataService.books.getCount(userId)
            .then(function (data) {
                $scope.bookCount = data;
                $scope.maxPage = Math.ceil($scope.bookCount / perPage);
                if (page > $scope.maxPage)
                    $scope.currentPage = $scope.maxPage;
                else
                    $scope.currentPage = page;
            })
            .then(function () {
                return dataService.books.getAll($scope.currentPage, perPage, userId)
                    .then(function (data) {
                        return data;
                    });
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
