"use strict"

var deps = ["$scope", "$state", "authService", "dataService", "toastr"];

function ctrl($scope, $state, authService, dataService, toastr) {
    //

    $scope.user = authService.getUser();
    $scope.submit = function (oldPass, newPass) {
        dataService.users.changePass($scope.user._id, oldPass, newPass)
            .then(function (data) {
                toastr.success("Changed password");
                $scope.close();
                console.log($scope);
            }, function (data) {
                $scope.hasError = true;
                toastr.error("Problem changing password.");
            })
            .then(cleanFields());
    };
    function cleanFields() {
        $scope.newPass = $scope.oldPass = "";
    }

    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("ModalChangePassController", ctrl);
};