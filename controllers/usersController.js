"use strict"
//var models = require("../models");
var repository = require("../repository");
var passport = require("passport");

exports.init = function (router) {

    router.get("/api/users", passport.authenticate("bearer", {session: false}), function (req, res) {
        repository.users.getAll(function (err, users) {
            if (err)
                res.customHandleError(err);
            else
                res.send(users);
        });
    });

    router.get("/api/users/:id", passport.authenticate("bearer", {session: false}), function (req, res) {
        repository.users.getById(req.params.id, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.send(user);
        });
    });

    //router.post("/api/users", function (req, res) {
    //    repository.users.insert(req.body, function (err, user) {
    //        if (err)
    //            res.customHandleError(err);
    //        else
    //            res.send(user);
    //    });
    //});

    router.put("/api/users/:id/changePass", passport.authenticate("bearer", {session: false}), function (req, res) {
        //TODO: Compare oldPass with req.user.password from passport
        repository.users.changePassword(req.params.id, req.body.oldPass, req.body.newPass, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.sendStatus(200);
        });
    });

    router.get("/api/users/:id/reverseAdmin", passport.authenticate("bearer", {session: false}), function (req, res) {
        repository.users.reverseIsAdmin(req.params.id, function (err, user) {
            if (err)
                res.customHandleError(err);
            else
                res.send(user);
        });
    });
};