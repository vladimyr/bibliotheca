"use strict";

var extend = require("extend-error");

///** @constructor */
//var NotFoundError = function (message) {
//    Error.call(this);
//    /** @type {string} */
//    this.name = "NotFoundError";
//    /** @type {*} */
//    this.message = message || "";
//    /** @type {number} */
//    this.code = 1000;
//};
//NotFoundError.prototype = Error.prototype;
//
///** @constructor */
//var UnauthorizedError = function (message) {
//    /** @type {string} */
//    this.name = "UnauthorizedError";
//    /** @type {*} */
//    this.message = message || "";
//    /** @type {number} */
//    this.code = 1001;
//};
//UnauthorizedError.prototype = Error.prototype;

//module.exports = {
//    NotFoundError: NotFoundError,
//    UnauthorizedError: UnauthorizedError
//};

module.exports = {
    NotFoundError: Error.extend("NotFoundError", 1000),
    UnauthorizedError: Error.extend("UnauthorizedError", 1001),
    ForbiddenError: Error.extend("ForbiddenError", 1002)
};