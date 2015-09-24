"use strict";

var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    var getAllUnverified = function () {
        dataService.books.getAllUnverified()
            .then(function (data) {
                $scope.books = data;
            });
    };
    getAllUnverified();

    $scope.decline = function (book) {
        openDeleteModal(book);
    };
    $scope.approve = function (book) {
        openVerifyModal(book);
    };
    function openDeleteModal(book) {
        $scope.deleteConfig = {
            title: "Confirm delete",
            message: "Are you sure you want to decline this request?" +
            " The book will be deleted permanently.",
            ok: function () {
                dataService.books.remove(book._id)
                    .then(function () {
                        getAllUnverified();
                    });
                $scope.showDeleteModal = false;
            },
            cancel: function () {
                $scope.showDeleteModal = false;
            }
        };
        $scope.showDeleteModal = true;
    }

    function openVerifyModal(book) {
        $scope.verifyConfig = {
            title: "Confirm approve",
            message: "Are you sure you want approve this book?",
            ok: function () {
                dataService.books.verify(book._id)
                    .then(function () {
                        getAllUnverified();
                    });
                $scope.showVerifyModal = false;
            },
            cancel: function () {
                $scope.showVerifyModal = false;
            }
        };
        $scope.showVerifyModal = true;
    }

    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("VerifyBooksController", ctrl);
};
