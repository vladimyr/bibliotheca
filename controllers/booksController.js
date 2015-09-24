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
            repository.books.getCount(req.query.user,generateCallback(res));
        }
        else//TODO: create config object
            repository.books.getAll(req.query.page, req.query.perPage, req.query.sortByLikes,req.query.user, generateCallback(res));
    });

    router.get("/api/books/unverified",noSessionBearerAuth,function(req,res){
       repository.books.getAllUnverified(generateCallback(res));
    });

    //TODO: books/wishList

    router.get("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.getById(req.params.id, generateCallback(res));
    });

    router.get("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.isLiked(req.params.id, req.user._id, generateCallback(res));
    });

    //TODO: return 200
    router.get("/api/books/:id/verify", noSessionBearerAuth, function (req, res) {
        repository.books.verify(req.params.id, generateCallback(res));
    });

    //TODO: Strip tags from desc when scraping, check noscript on page source
    router.post("/api/books", noSessionBearerAuth, function (req, res) {
        //req.body.user = req.user.id;
        repository.books.insert(req.body,req.user.id, generateCallback(res));
    });

    router.put("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.update(req.params.id, req.body, generateCallback(res));
    });

    //TODO: return 200
    router.put("/api/books/:id/status", noSessionBearerAuth, function (req, res) {
        repository.books.updateStatus(req.params.id, req.body.status, generateCallback(res));
    });

    //TODO: return 200
    router.put("/api/books/:id/like", noSessionBearerAuth, function (req, res) {
        repository.books.reverseLike(req.params.id, req.user._id, generateCallback(res));
    });

    //TODO: will return 200 after reverseLike is updated
    router.put("/api/books/:id/rent", noSessionBearerAuth, function (req, res) {
        repository.books.rentNext(req.params.id, generateCallback(res));
    });

    //TODO: return 200
    router.delete("/api/books/:id", noSessionBearerAuth, function (req, res) {
        repository.books.delete(req.params.id, generateCallback(res, 200));
    });

};