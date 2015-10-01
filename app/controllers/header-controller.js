"use strict";

var $ = require("jquery");

var deps = ["$scope", "authService", "dataService"];

function ctrl($scope, authService, dataService) {
    //
    $scope.dropdownControl = {};
    $scope.dropdownConfig = {
        action: "hide"
    };

    $scope.user = authService.getUser();
    //$scope.unverifiedCount = 0;

    //if ($scope.user.isAdmin) {
    //    dataService.books.getUnverifiedCount()
    //        .then(function (data) {
    //            $scope.unverifiedCount = data;
    //        });
    //}


    $scope.logout = function () {
        $scope.dropdownControl.destroy();
        authService.clearUser();
    };
    $scope.changePass = function () {
        $scope.showModal = true;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HeaderController", ctrl);
};
