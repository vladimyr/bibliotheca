"use strict";

var $ = require("jquery");

var deps = ["$scope", "authService"];
function ctrl($scope, authService) {

    var $dropdown = $(".ui.pointing").dropdown();

    $scope.user = authService.getUser();

    $scope.logout = function () {
        $dropdown.dropdown("destroy");
        authService.clearUser();
    };
    $scope.changePass = function () {
        //modal
        $('.ui.modal')
            .modal('show')
        ;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HeaderController", ctrl);
};
