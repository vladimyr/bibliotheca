"use strict"
//var models = require("../models");
var repository = require("../repository");

exports.init = function (router) {

    router.get("/api/users", function (req, res) {
        repository.users.getAll(function (err, users) {
            if (err)
                res.customHandleError(err);
            else
                res.send(users);
        });
    });

    router.get("/api/users/:id", function (req, res) {
        repository.users.getById(req.params.id, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.send(user);
        });
    });

    router.post("/api/users", function (req, res) {
        repository.users.insert(req.body, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.send(user);
        });
    });

    router.put("/api/users/:id/changePass", function (req, res) {
        //TODO: Compare oldPass with req.user.password from passport
        repository.users.changePassword(req.params.id, req.body.oldPass, req.body.newPass, function (err, book) {
            if (err)
                res.customHandleError(err);
            else
                res.send(book);
        });
    });

    router.put("/api/users/:id/reverseAdmin", function (req, res) {
        repository.users.reverseIsAdmin(req.params.id, req.body.oldPass, req.body.newPass, function (err, book) {
            if (err)
                res.customHandleError(err);
            else
                res.send(book);
        });
    });
};