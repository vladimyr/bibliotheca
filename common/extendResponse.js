"use strict"
var express = require("express");
/**
 * Responds depending on the type of error
 * @param {Error} err
 */
express.response.customHandleError = function (err) {
    if (err.name == "NotFoundError" || err.name == "CastError")
        this.status(404).send(err);
    else if (err.name == "UnauthorizedError")
        this.status(401).send(err);
    else
        this.status(500).send(err);
};