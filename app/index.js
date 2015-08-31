"use strict";

// .css
require("bootstrap/dist/css/bootstrap.css");

// .js
require("jquery");
require("bootstrap");
var angular = require("angular");
var router = require("angular-ui-router");

//console.log("Path je: " + require.resolve("angular-ui-router"));

// app
var app = angular.module("app", [router]);
//config
require("./config.js")(app);
// controllers
var controllers = require.context('./controllers', true, /.js$/);
//controllers.keys().forEach(controllers);
controllers.keys().forEach(function (x) {
    controllers(x)(app);
});
