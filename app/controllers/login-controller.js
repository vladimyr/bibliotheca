"use strict";

var deps = ["$scope", "authService", "$state"];

function ctrl($scope, authService, $state) {
    //
    $scope.remember = false;
    $scope.login = function () {
        authService.login($scope.email, $scope.password, $scope.remember)
            .then(function (res) {
                $state.go("root.home");
            }, function (res) {
                $scope.res = "Invalid username or password.";
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("LoginController", ctrl);
};
