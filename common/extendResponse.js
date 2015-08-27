"use strict"
var express = require("express");
var errorEnum = require("./errorEnum.js");
/**
 * Responds depending on the type of error
 * @param {Error} err
 */
express.response.customHandleError = function (err) {
    if (err.code === errorEnum.NotFoundError) {
        this.status(404).send(err);
    } else if (err.code === errorEnum.UnauthorizedError) {
        this.status(401).send(err);
    } else
        this.sendStatus(500);
};