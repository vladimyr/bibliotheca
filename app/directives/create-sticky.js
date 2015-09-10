"use strict";

var $ = require("jquery");

var deps = [];
function dir() {
    //
    return {
        restrict: "A",
        link: function (scope, element, attrs) {
            $(element).sticky(scope.$eval(attrs.createSticky));
        }
    };
    //
}
dir.$inject = deps;

module.exports = function (app) {
    app.directive("createSticky", dir);
};
