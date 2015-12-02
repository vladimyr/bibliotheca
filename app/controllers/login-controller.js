"use strict";

var deps = ["$scope", "authService", "$state"];

function ctrl($scope, authService, $state) {
    //
    $scope.isLogin = $state.current.data.isLogin;
    $scope.hasRegistered = false;
    $scope.msg = "";
    $scope.remember = false;
    $scope.login = function () {
        $scope.submitted = true;
        if ($scope.loginForm.$invalid) {
            return;
        }
        authService.login($scope.email, $scope.password, $scope.remember)
            .then(function (res) {
                $state.go("root.home");
            }, function (res) {
                if (res.status == 403) {
                    $scope.msg = "This user isn't verified yet. ";
                }
                else {
                    $scope.msg = "Invalid username or password. ";
                }

            });
    };
    $scope.register = function () {
        if ($scope.loginForm.$invalid) {
            $scope.submitted = true;
            return;
        }
        authService.register($scope.email, $scope.password)
            .then(function (res) {
                if (res.status === 204) {
                    $scope.msg = "User with that email already exists. ";
                }
                else if (res.status === 200) {
                    $scope.msg = "";
                    $scope.hasRegistered = true;
                }
            }, function (res) {
                $scope.msg = "An error occured, please try again. ";
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("LoginController", ctrl);
};
