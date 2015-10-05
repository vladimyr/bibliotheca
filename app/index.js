"use strict";

// .css
require("../semantic/dist/semantic.css");
require("angular-toastr/dist/angular-toastr.css")

// .js
require("jquery");
require("../semantic/dist/semantic.js");
var angular = require("angular");
require("angular-ui-router");
require("angular-animate");
require("angular-toastr");

// app
var app = angular.module("app", ["ui.router","toastr"]);
// run config
require("./runConfig.js")(app);
//route config
require("./appConfig.js")(app);
// values
var values = require.context("./values", true, /.js$/);
values.keys().forEach(function (x) {
    values(x)(app);
});
// services
var services = require.context("./services", true, /.js$/);
services.keys().forEach(function (x) {
    services(x)(app);
});
// directives
var directives = require.context("./directives", true, /.js$/);
directives.keys().forEach(function (x) {
    directives(x)(app);
});
// controllers
var controllers = require.context("./controllers", true, /.js$/);
controllers.keys().forEach(function (x) {
    controllers(x)(app);
});

