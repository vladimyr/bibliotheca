"use strict";

//var $ = require("jquery");
var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
        dataService.books.getAll(1, 5, null, true)
        .then(function (data) {
            $scope.books = data;
            $scope.books.forEach(function (val) {
                dataService.books.isLiked(val._id);
            });
        });

    $scope.stickyConfig = {
        offset: 70,
        context: "#sticky-segment"
    };


    $scope.openModal = function (book) {
        $scope.bookInstance = book;
        $scope.showModal = true;
    };
    //moved to directive
    //    $("#sticky-component")
    //        .sticky($scope.stickyConfig);

    //the function to hide the div
    //function hideDiv() {
    //
    //    if ($(window).width() < 1024) {
    //
    //        $("#sticky-sidebar").fadeOut("slow");
    //
    //    } else {
    //
    //        $("#sticky-sidebar").fadeIn("slow");
    //
    //    }
    //
    //}

//run on document load and on window resize
//    $(document).ready(function () {
//
//        //on load
//        hideDiv();
//
//        //on resize
//        $(window).resize(function () {
//            hideDiv();
//        });
//
//    });
    //
}
ctrl.$inject = deps;

module.exports = function (app) {
    app.controller("HomeController", ctrl);
};
