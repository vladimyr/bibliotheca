"use strict"
var mongoose = require("mongoose");
var mongoUrl = require("../config").mongoUrl;
var logger = require("../logger");

mongoose.connect(mongoUrl);

var db = mongoose.connection;

db.on('error', function (err) {
    logger.info("Couldn't connect to database " + mongoUrl, err);
});
db.once('open', function () {
    logger.info("Connected to database " + mongoUrl);
});

module.exports = {
    books: require("./books.js"),
    users: require("./users.js")
};