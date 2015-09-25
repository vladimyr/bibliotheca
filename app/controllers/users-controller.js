"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    $scope.currentPage = 1;
    $scope.userCount = 0;
    var perPage = 4;

    $scope.getUsers = function (page) {
        dataService.users.getCount()
            .then(function (data) {
                $scope.userCount = data;
                $scope.maxPage = Math.ceil($scope.userCount / perPage);
                if ($scope.maxPage === 0)
                    $scope.maxPage++;
                if (page > $scope.maxPage)
                    $scope.currentPage = $scope.maxPage;
                else
                    $scope.currentPage = page;
            })
            .then(function () {
                return dataService.users.getAll($scope.currentPage, perPage)
                    .then(function (data) {
                        $scope.users = data;
                    })
            });
    };
    $scope.getUsers($scope.currentPage);

    $scope.openBookModal = function (book) {
        dataService.books.getById(book._id)
            .then(function (data) {
                $scope.bookInstance = data;
                $scope.showBookModal = true;
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("UsersController", ctrl);
};
