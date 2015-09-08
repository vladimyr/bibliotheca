"use strict";

var deps = ["$scope", "authService", "$state"];

function ctrl($scope, authService, $state) {
    //
    $scope.isLogin = $state.current.data.isLogin;
    $scope.hasRegistered = false;
    $scope.remember = false;
    $scope.login = function () {
        authService.login($scope.email, $scope.password, $scope.remember)
            .then(function (res) {
                $state.go("root.home");
            }, function (res) {
                $scope.msg = "Invalid username or password.";
            });
    };
    $scope.register = function () {
        authService.register($scope.email, $scope.password)
            .then(function (res) {
                if (res.status === 204)
                    $scope.msg = "User with that email already exists. Forgot your password?";
                else if (res.status === 200){
                    $scope.msg="";
                    $scope.hasRegistered = true;
                }

            },function(res){
                $scope.msg="Please fill the password field.";
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("LoginController", ctrl);
};
