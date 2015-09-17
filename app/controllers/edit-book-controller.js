"use strict";

var $ = require("jquery");

var deps = ["$scope", "dataService", "getBookResolver", "toastr"];

function ctrl($scope, dataService, getBookResolver, toastr) {
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
                .then(function(data){
                    toastr.success("Updated book.");
                    return data;
                });
        else
            action = dataService.books.insert(book)
                .then(function(data){
                    toastr.success("Inserted new book.");
                    return data;
                });

        action.then(function (data) {
            $scope.book = data;
        });
    };
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("EditBookController", ctrl);
};
