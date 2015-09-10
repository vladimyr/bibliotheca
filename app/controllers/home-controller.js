"use strict";

var $ = require("jquery");
var deps = ["$scope", "dataService"];

function ctrl($scope, dataService) {
    //
    dataService.books.getAll(1, 5, true)
        .then(function (res) {
            $scope.books = res.data;
        });
    $(document).ready(function () {
        $(".ui.sticky")
            .sticky({
                context: "#sticky-segment"
            });
    });

    //the function to hide the div
    function hideDiv() {

        if ($(window).width() < 1024) {

            $("#sticky-sidebar").fadeOut("slow");

        } else {

            $("#sticky-sidebar").fadeIn("slow");

        }

    }

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
