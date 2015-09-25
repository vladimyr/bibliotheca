"use strict";

var $ = require("jquery");

var deps = ["$scope", "dataService", "getBookResolver", "toastr", "$state"];

function ctrl($scope, dataService, getBookResolver, toastr, $state) {
    //
    $scope.book = getBookResolver;
    //TODO: make ajax request to server to get amazon title (nodejs will make amazon request)
    // cheerio
    // check vladimyr
    if (!$scope.book) {
        $scope.book = {};
    }

    $scope.submit = function (book) {
        var action;

        if (book._id)
            action = dataService.books.update(book._id, book)
                .then(function (data) {
                    toastr.success("Updated book.");
                    $scope.book = data;
                    return data;
                }, function () {
                    toastr.error("Error updating book.");
                });
        else
            action = dataService.books.insert(book)
                .then(function (data) {
                    toastr.success("Admin will have to verify it before " +
                        "you will be able to see it in your books.", "Inserted new book.");
                    $state.go("root.home");
                    $scope.book = data;
                    return data;
                }, function () {
                    toastr.error("Error inserting book.");
                });

        action;
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("EditBookController", ctrl);
};
