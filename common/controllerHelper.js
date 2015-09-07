"use strict";

/**
 * Returns a function which responds with the result or with status code if provided.
 * @param {Object} res - The response object
 * @param {Number} [status] - Status code to send as response
 * @returns {Function} - Callback function to execute, which handles the error as the first argument and the result as second.
 */
var generateCallback = function (res, status) {
    return function callback(err, result) {
        if (err)
            res.customHandleError(err);
        else if (status)
            res.sendStatus(200);
        else
            res.send(result);
    }
};

module.exports = {
    generateCallback: generateCallback
};