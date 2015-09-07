"use strict";

var $ = require("jquery");
var deps = ["$scope"];

function ctrl($scope) {
    //
    //$("#config-button").dropdown();
    $scope.logout = function () {

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
