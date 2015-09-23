"use strict"

var deps = ["$stateProvider", "$urlRouterProvider", "$httpProvider", "toastrConfig"];
function cfg($stateProvider, $urlRouterProvider, $httpProvider, toastrConfig) {

    $httpProvider.interceptors.push("authInterceptor");

    angular.extend(toastrConfig, {timeOut: 2000});

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
        .state("root.editBook", {
            url: "/editBook/:id",
            template: require(viewsRoot + "edit-book.html"),
            controller: "EditBookController",
            resolve: {
                getBookResolver: ["dataService", "$stateParams", function (dataService, $stateParams) {
                    var bookId = $stateParams.id;
                    if (bookId != "newBook")
                        return dataService.books.getById(bookId);
                    else
                        return;
                }]
            }
        })
    ;
};
cfg.$inject = deps;
module.exports = function (app) {
    app.config(cfg);
};