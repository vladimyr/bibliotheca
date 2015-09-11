"use strict";

var $ = require("jquery");

var deps = [];
function dir() {
    //
    return {
        restrict: "A",
        scope: {
            control: "=",
            config:"="
        },
        link: function (scope, element, attrs) {
            scope.control = $(element).dropdown(scope.config);
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("createDropdown", dir);
};
