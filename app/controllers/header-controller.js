"use strict";

var $ = require("jquery");

var deps = ["$scope", "authService"];

function ctrl($scope, authService) {
    //
    $scope.dropdownControl = {};
    $scope.dropdownConfig = {
        action: "hide"
    };

    $scope.user = authService.getUser();


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
