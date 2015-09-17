"use strict";
var express = require("express");
var errorEnum = require("./errorEnum.js");
var logger = require("../logger");
/**
 * Extension to the Express response object. Responds depending on the type of error
 * @param {Error} err
 */
express.response.customHandleError = function (err) {
    if (err.code === errorEnum.NotFoundError) {
        this.status(404).send(err);
    } else if (err.code === errorEnum.UnauthorizedError) {
        this.status(401).send(err);
    } else if (err.code == errorEnum.ForbiddenError) {
        this.status(403).send(err);
    } else
        this.sendStatus(500);
    logger.error(err);
};