"use strict";

//var $ = require("jquery");
var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //

    dataService.books.getAll(1, 5, null, null, true)
        .then(function (data) {
            $scope.books = data;
        });

    $scope.stickyConfig = {
        offset: 70,
        context: "#sticky-segment"
    };


    $scope.openBookModal = function (book) {
        $scope.bookInstance = book;
        $scope.showBookModal = true;
    };

}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HomeController", ctrl);
};
