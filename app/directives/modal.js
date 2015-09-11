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
            scope.reverseLike = function (book) {
                dataService.books.reverseLike(book._id)
                    .then(function (res) {
                        if (book.isLiked)
                            book.likeNumber--;
                        else
                            book.likeNumber++;
                        book.isLiked = !book.isLiked;
                    });
            };
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("modal", dir);
};
