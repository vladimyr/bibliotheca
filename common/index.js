"use strict";

/**
 * Initialize all custom extensions
 */
var initExtensions = function () {
    require("./extendResponse.js");
};
module.exports = {
    initExtensions: initExtensions,
    errors: require("./errors.js"),
    controllerHelper: require("./controllerHelper.js")
};