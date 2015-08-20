"use strict"
//var models = require("../models");
var repository = require("../repository");

exports.init = function (router) {

    router.get("/api/books", function (req, res) {
        repository.books.getAll(function (err, books) {
            if (err)
                res.customHandleError(err);
            else
                res.send(books);
        });
    });

    router.get("/api/books/:id", function (req, res) {
        repository.books.getById(req.params.id, function (err, book) {
            if (err)
                res.customHandleError(err);
            else
                res.send(book);
        });
    });

    router.post("/api/books", function (req, res) {
        //TODO: Get user from passport, not from object, change tests accordingly
        //req.body.user = req.user._id;
        repository.books.insert(req.body, function (err, book) {
            if (err)
                res.customHandleError(err);
            else
                res.send(book);
        });
    });

    router.put("/api/books/:id", function (req, res) {
        repository.books.update(req.params.id, req.body, function (err, book) {
            if (err)
                res.customHandleError(err);
            else
                res.send(book);
        });
    });

    router.delete("/api/books/:id", function (req, res) {
        repository.books.delete(req.params.id, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.send(user);
        });
    });

};