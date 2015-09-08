"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    $scope.currentPage = 1;
    $scope.bookCount = 0;
    var perPage = 4;

    $scope.getBooks = function (page) {
        dataService.books.getAllCount()
            .then(function (res) {
                $scope.bookCount = res.data;
                $scope.maxPage = Math.ceil($scope.bookCount / perPage);
                if (page > $scope.maxPage)
                    $scope.currentPage = $scope.maxPage;
                else
                    $scope.currentPage = page;

                return dataService.books.getAll($scope.currentPage, perPage);
            })
            .then(function (res) {
                $scope.books = res.data;
                $scope.books.forEach(function (val) {
                    if (val.description.length > 260)
                        val.shortDesc = val.description.substring(0, 260) + "...";
                });

            });
    };
    $scope.getBooks($scope.currentPage);
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("BooksController", ctrl);
};
