"use strict";

// .css
//require("bootstrap/dist/css/bootstrap.css");
require("../semantic/dist/semantic.css");

// .js
require("jquery");
//require("bootstrap");
require("../semantic/dist/semantic.js");
var angular = require("angular");
require("angular-ui-router");

// app
var app = angular.module("app", ["ui.router"]);
// run config
require("./runConfig.js")(app);
//route config
require("./appConfig.js")(app);
// services
var services = require.context("./services", true, /.js$/);
services.keys().forEach(function (x) {
    services(x)(app);
});
// controllers
var controllers = require.context("./controllers", true, /.js$/);
controllers.keys().forEach(function (x) {
    controllers(x)(app);
});
