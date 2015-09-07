"use strict";

var deps = ["$scope"];

function ctrl($scope) {
    //
    $scope.login = function () {

    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("LoginController", ctrl);
};
