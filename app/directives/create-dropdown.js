"use strict";

var $ = require("jquery");

var deps = [];
function dir() {
    //
    return {
        restrict: "A",
        scope: {
            control: "="
        },
        link: function (scope, element, attrs) {
            scope.control = $(element).dropdown(scope.$eval(attrs.createDropdown));
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("createDropdown", dir);
};
