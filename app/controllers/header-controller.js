"use strict";

//var $ = require("jquery");

var deps = ["$scope", "authService"];
function ctrl($scope, authService) {
    //$("#config-button").dropdown();
    $scope.user = authService.getUser();

    $scope.logout = function () {
        authService.clearUser();
    };
    $scope.changePass = function () {
        //modal
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HeaderController", ctrl);
};
