"use strict"

var deps = ["$scope", "$state", "$stateParams", "dataService"];

function ctrl($scope, $state, $stateParams, dataService) {
    //
    $scope.reverseLike = function (book) {
        dataService.books.reverseLike(book._id);
    };
    $scope.edit = function (book) {
        $scope.close();
        $state.go("root.editBook", {id: book._id});
    };
    $scope.remove = function (book) {
        $scope.close();
        dataService.books.remove(book._id)
            .then(function () {
                $state.reload();
            });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("ModalBookController", ctrl);
};