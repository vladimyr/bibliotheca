"use strict"

var deps = ["$stateProvider", "$urlRouterProvider", "$httpProvider"];
function cfg($stateProvider, $urlRouterProvider, $httpProvider) {

    $httpProvider.interceptors.push("authInterceptor");

    var viewsRoot = "./views/";
    $urlRouterProvider.otherwise("/home");
    $stateProvider
        .state("login", {
            url: "/login",
            template: require(viewsRoot + "login.html"),
            controller: "LoginController",
            data: {
                isLogin: true
            }
        })
        .state("register", {
            url: "/register",
            template: require(viewsRoot + "login.html"),
            controller: "LoginController",
            data: {
                isLogin: false
            }
        })
        .state("root", {
            abstract: true,
            views: {
                "": {
                    template: require(viewsRoot + "layout.html")
                },
                "header@root": {
                    template: require(viewsRoot + "header.html"),
                    controller: "HeaderController"
                }
            }
        })
        .state("root.home", {
            url: "/home",
            views: {
                "": {
                    template: require(viewsRoot + "home.html"),
                    controller: "HomeController"
                    //resolve: {
                    //    topBooksResolver: ["dataService", function (dataService) {
                    //        return dataService.books.getAll(1, 5, true);
                    //    }]
                    //}
                },
                "books@root.home": {
                    template: require(viewsRoot + "books.html"),
                    controller: "BooksController"
                }
            },
            data: {
                isUser: false
            }
        })
        .state("root.user", {
            url: "/user",
            views: {
                "": {
                    template: require(viewsRoot + "user.html"),
                    controller: "UserController"
                },
                "books@root.user": {
                    template: require(viewsRoot + "books.html"),
                    controller: "BooksController"
                }
            },
            data: {
                isUser: true
            }
        })
    ;
};
cfg.$inject = deps;
module.exports = function (app) {
    app.config(cfg);
};