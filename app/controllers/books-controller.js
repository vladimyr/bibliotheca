"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    dataService.books.getAll()
        .then(function (res) {
            $scope.books = res.data;
            $scope.books.forEach(function (val) {
                if (val.description.length > 260)
                    val.shortDesc = val.description.substring(0, 260) + "...";
            });
        });
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("BooksController", ctrl);
};
