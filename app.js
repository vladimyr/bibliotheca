"use strict"
var config = require("./config");
var express = require("express");
var app = express();
app.use(express.static(__dirname + "/public"));

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

var router = express.Router();
app.use(router);

var auth = require("./auth");
auth.init(app);

var controllers = require("./controllers");
controllers.init(router);

app.get('*', function (req, res) {
    res.sendFile(__dirname + "/public/app/index.html");
});

var port = config.port;
app.listen(port);
console.log("Listening on port: " + port);