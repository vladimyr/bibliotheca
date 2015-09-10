"use strict";

var $ = require("jquery");

var deps = ["$scope", "authService"];
function ctrl($scope, authService) {

    $scope.dropdownControl = {};
    $scope.user = authService.getUser();


    $scope.logout = function () {
        $scope.dropdownControl.dropdown("destroy");
        authService.clearUser();
    };
    $scope.changePass = function () {

    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HeaderController", ctrl);
};
