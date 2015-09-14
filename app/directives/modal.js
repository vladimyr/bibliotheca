"use strict";

// This directive uses an external template as modal dialog.
var $ = require("jquery");

var deps = ["dataService"];
function dir(dataService) {
    //
    return {
        restrict: "E",
        replace: true,
        require: "ngModel",
        //template: require("../views/modal-book.html"),
        template: function (el, att) {
            return require("../views/" + att.template);
        },
        scope: {
            bookInstance: "="
        },
        link: function (scope, element, attrs, ngModel) {
            $(element).modal({
                onHide: function () {
                    ngModel.$setViewValue(false);
                }
            });
            scope.$watch(function () {
                return ngModel.$modelValue;
            }, function (modelValue) {
                $(element).modal(modelValue ? "show" : "hide");
            });
        },
        //TODO: remove this "reverseLike" logic to caller controller
        controller: ["$scope", function ($scope) {
            $scope.reverseLike = function (book) {
                dataService.books.reverseLike(book._id);
            };
        }]
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("modal", dir);
};
