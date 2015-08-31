"use strict"

var deps = ["$stateProvider", "$urlRouterProvider"];
var cfg = function ($stateProvider, $urlRouterProvider) {
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state("root", {
            abstract: true,
            views: {
                "": {
                    templateUrl: require("./views/layout.html")
                    //templateProvider: function($templateCache){
                    //    // simplified, expecting that the cache is filled
                    //    // there should be some checking... and async $http loading if not found
                    //    return $templateCache.get(require("./views/layout.html"));
                    //}
                    //templateUrl: require("ngtemplate!html!./views/layout.html")
                    //templateUrl:require("ng-cache!./views/layout.html")
                }
                //,
                //"header@root": {
                //    templateUrl: viewsRoot + "header.html",
                //    controller: "HeaderController"
                //}
            }
        })
        .state("root.home", {
            url: "/home",
            templateUrl: require("./views/home.html"),
            //templateUrl: require("ngtemplate!html!./views/home.html"),
            //templateUrl:require("ng-cache!./views/home.html"),
            controller: "HomeController"
        });
};
cfg.$inject = deps;
module.exports = function (app) {
    app.config(cfg);
};