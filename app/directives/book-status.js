"use strict";

var bookStatusEnum = require("../../enums").bookStatus;

var deps = [];
function dir() {
    //
    return {
        restrict: "E",
        replace: true,
        scope: {
            book: "="
        },
        template: "<span>" +
        "<span ng-if='book.status==bookStatusEnum.Wishlisted'>Not ordered</span>" +
        "<span ng-if='book.status==bookStatusEnum.Ordered' style='color:darkgoldenrod'>Ordered</span>" +
        "<span ng-if='book.status==bookStatusEnum.Available' style='color:green'>Available</span>" +
        "<span ng-if='book.status==bookStatusEnum.Rented' style='color:red'>Rented</span>" +
        "</span>",
        link: function (scope, element, attrs, ngModel) {
            scope.bookStatusEnum = bookStatusEnum;
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("bookStatus", dir);
};
