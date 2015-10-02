"use strict";
//var models = require("../models");
var repository = require("../repository");
var generateCallback = require("../common").controllerHelper.generateCallback;
var passport = require("passport");
var noSessionBearerAuth = passport.authenticate("bearer", {session: false});
var auth = require("../auth");

exports.init = function (router) {

    router.get("/api/books", noSessionBearerAuth, function (req, res) {
        var config = {
            page: req.query.page,
            perPage: req.query.perPage,
            sortByLikes: req.query.sortByLikes,
            search: req.query.search,
            userId: req.query.user
        };
        if (req.query.count) {

            repository.books.getCount(config, true, generateCallback(res));
        }
        else {
            repository.books.getAll(config, generateCallback(res));
        }
    });

    router.get("/api/books/unverified", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        var config = {
            page: req.query.page,
            perPage: req.query.perPage,
            sortByLikes: req.query.sortByLikes,
            search: req.query.search,
            userId: req.query.user
        };
        if (req.query.count) {
            repository.books.getCount(config, false, generateCallback(res));
        } else
            repository.books.getAllUnverified(generateCallback(res));
    });

    router.get("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.getById(req.params.id, generateCallback(res));
    });

    router.get("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.isLiked(req.params.id, req.user._id, generateCallback(res));
    });

    router.get("/api/books/:id/verify", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.books.verify(req.params.id, generateCallback(res, 200));
    });

    router.post("/api/books", noSessionBearerAuth, function (req, res) {
        repository.books.insert(req.body, req.user.id, generateCallback(res));
    });

    router.put("/api/books/:id", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.books.update(req.params.id, req.body, generateCallback(res));
    });

    router.put("/api/books/:id/status", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.books.updateStatus(req.params.id, req.body.status, generateCallback(res));
    });

    router.put("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.reverseLike(req.params.id, req.user._id, generateCallback(res, 200));
    });

    router.put("/api/books/:id/rent", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.books.rentNext(req.params.id, generateCallback(res, 200));
    });

    router.delete("/api/books/:id", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.books.delete(req.params.id, generateCallback(res, 200));
    });

};