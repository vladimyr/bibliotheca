"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    $scope.msg = "";

    $scope.submit = function () {
        if ($scope.forgotPassForm.$invalid) {
            $scope.submitted = true;
            return;
        }
        dataService.users.getNewPass($scope.email)
            .then(function (res) {
                $scope.msg = "";
                $scope.hasGottenNew = true;
            }, function (res) {
                if (res.status == 404)
                    $scope.msg = "No such user.";
                else
                    $scope.msg = "An error occured, please try again";
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("ForgotPassController", ctrl);
};
