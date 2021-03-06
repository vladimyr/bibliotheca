"use strict";

var $ = require("jquery");

var deps = [];

function dir() {
    //
    return {
        restrict: "A",
        scope: {
            control: "=",
            config: "="
        },
        link: function (scope, element, attrs) {
            scope.control = $(element).dropdown(scope.config);
            scope.control.destroy = function () {
                scope.control.dropdown("destroy");
            };
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("createDropdown", dir);
};
