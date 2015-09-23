"use strict";
//var models = require("../models");
var repository = require("../repository");
var generateCallback = require("../common").controllerHelper.generateCallback;
var passport = require("passport");
var noSessionBearerAuth = passport.authenticate("bearer", {session: false});

exports.init = function (router) {

    router.get("/api/books", noSessionBearerAuth, function (req, res) {
        //TODO: search
        if (req.query.count) {
            if (req.query.user)
                repository.users.getById(req.query.user)
                    .then(function (user) {
                        return user.likedBooks.length.toString();
                    })
                    .nodeify(generateCallback(res));
            else
                repository.books.getAllCount(generateCallback(res));
        }
        else//TODO: create config object
            repository.books.getAll(req.query.page, req.query.perPage, req.query.sortByLikes,req.query.user, generateCallback(res));
    });

    //TODO: books/wishList

    router.get("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.getById(req.params.id, generateCallback(res));
    });

    //TODO: Strip tags from desc when scraping, check noscript on page source
    router.post("/api/books", noSessionBearerAuth, function (req, res) {
        //req.body.user = req.user.id;
        repository.books.insert(req.body,req.user.id, generateCallback(res));
    });

    router.put("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.update(req.params.id, req.body, generateCallback(res));
    });

    router.put("/api/books/:id/status", noSessionBearerAuth, function (req, res) {
        repository.books.updateStatus(req.params.id, req.body.status, generateCallback(res));
    });

    router.put("/api/books/:id/rent", noSessionBearerAuth, function (req, res) {
        repository.books.rentNext(req.params.id, generateCallback(res));
    });

    router.delete("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.delete(req.params.id, generateCallback(res, 200));
    });

    router.get("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.isLiked(req.params.id, req.user._id, generateCallback(res));
    });

    router.put("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.reverseLike(req.params.id, req.user._id, generateCallback(res));
    });

};