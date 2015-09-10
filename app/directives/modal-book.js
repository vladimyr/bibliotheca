"use strict";

// This directive uses an external template as modal dialog.
var $ = require("jquery");

var deps = [];
function dir() {
    //
    return {
        restrict: "E",
        replace: true,
        require: "ngModel",
        template: require("../views/modal.html"),
        scope:{
            bookInstance:"="
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
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("modalBook", dir);
};
