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
                .then(function (res) {
                    return res.data.books;
                });
        else
            return dataService.books.getAll($scope.currentPage, perPage)
                .then(function (res) {
                    return res.data;
                });
    };

    $scope.getBooks = function (page) {
        dataService.books.getAllCount()
            .then(function (res) {
                $scope.bookCount = res.data;
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
                    if (val.description.length > 260)
                        val.shortDesc = val.description.substring(0, 260) + "...";
                    dataService.books.isLiked(val._id)
                        .then(function (res) {
                            val.isLiked = res.data;
                        });
                });

            });
    };
    $scope.getBooks($scope.currentPage);

    $scope.reverseLike = function (book) {
        dataService.books.reverseLike(book._id)
            .then(function (res) {
                if (book.isLiked)
                    book.likeNumber--;
                else
                    book.likeNumber++;
                book.isLiked = !book.isLiked;
            });
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
