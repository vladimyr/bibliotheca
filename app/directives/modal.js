"use strict";

// This directive transcludes the content of its caller element.
var $ = require("jquery");

var deps = [];
function dir() {
    //
    return {
        restrict: "E",
        replace: true,
        transclude: true,
        require: "ngModel",
        template: "<div class='ui modal long test' ng-transclude></div>",
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
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("modal", dir);
};
