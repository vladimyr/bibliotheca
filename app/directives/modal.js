"use strict";

// This directive uses an external template as modal dialog.
var $ = require("jquery");

var deps = ["$controller"];
function dir($controller) {
    //
    return {
        restrict: "E",
        replace: true,
        require: "ngModel",
        template: function (el, att) {
            return require("../views/" + att.template);
        },
        scope: {
            sourceObject: "="
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

            scope.close = function () {
                ngModel.$setViewValue(false);
            };
            if (attrs.controller)
                $controller(attrs.controller, {$scope: scope});
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("modal", dir);
};
