"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    $scope.currentPage = 1;
    $scope.userCount = 0;
    var perPage = 10;

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
    $scope.reverseAdmin = function (user) {
        openReverseAdminModal(user);
    };


    function openReverseAdminModal(user) {
        var message = "Are you sure you want to ";
        if (user.isAdmin)
            message += "give admin rights to " + user.email + "?";
        else
            message += "remove admin rights from " + user.email + "?";

        $scope.reverseAdminConfig = {
            title: "Confirm admin rights change",
            message: message,
            ok: function () {
                dataService.users.reverseAdmin(user._id);
                $scope.showReverseAdminModal = false;
            },
            cancel: function () {
                user.isAdmin = !user.isAdmin;
                $scope.showReverseAdminModal = false;
            }
        };
        $scope.showReverseAdminModal = true;
    }

    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("UsersController", ctrl);
};
