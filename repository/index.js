"use strict"
var mongoose = require("mongoose");
var mongoUrl = require("../config").mongoUrl;

mongoose.connect(mongoUrl);

var db = mongoose.connection;

db.on('error', function (err) {
    console.log("Couldn't connect to database " + mongoUrl, err);
});
db.once('open', function () {
    console.log("Connected to database " + mongoUrl);
});

module.exports = {
    books: require("./books.js"),
    users: require("./users.js")
};