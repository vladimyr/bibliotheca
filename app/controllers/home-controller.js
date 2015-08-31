"use strict"
//module.exports = function (app) {
//    app.controller("HomeController", ["$scope", function ($scope) {
//        $scope.testBox = "test";
//    }]);
//};
var angular=require("angular");
var deps = ["$scope"];
var ctrl = function ($scope) {
    $scope.testBox = "test";
};
ctrl.$inject = deps;
module.exports = function (app) {
    app.controller("HomeController", ctrl);
};

