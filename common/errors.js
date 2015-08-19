"use strict"
/** @constructor */
var NotFoundError = function (message) {
    /** @type {string} */
    this.name = "NotFoundError";
    /** @type {*} */
    this.message = message || "";
};
NotFoundError.prototype = Error.prototype;

/** @constructor */
var UnauthorizedError = function (message) {
    /** @type {string} */
    this.name = "UnauthorizedError";
    /** @type {*} */
    this.message = message || "";
};
UnauthorizedError.prototype = Error.prototype;

module.exports = {
    NotFoundError: NotFoundError,
    UnauthorizedError: UnauthorizedError
};