"use strict";
//var models = require("../models");
var repository = require("../repository");
var passport = require("passport");
var generateCallback = require("../common").controllerHelper.generateCallback;
var noSessionBearerAuth = passport.authenticate("bearer", {session: false});

exports.init = function (router) {

    router.get("/api/users", noSessionBearerAuth, function (req, res) {
        //repository.users.getAll(generateCallback(res));
        if (req.query.count) {
            repository.users.getCount(generateCallback(res));
        }
        else//TODO: create config object
            repository.users.getAll(req.query.page, req.query.perPage, generateCallback(res));
    });

    router.get("/api/users/:id", noSessionBearerAuth, function (req, res) {
        repository.users.getById(req.params.id, generateCallback(res));
    });

    router.get("/api/users/:id/reverseAdmin", noSessionBearerAuth, function (req, res) {
        repository.users.reverseIsAdmin(req.params.id, generateCallback(res));
    });

    router.put("/api/users/:id/changePass", noSessionBearerAuth, function (req, res) {
        //TODO: Compare oldPass with req.user.password from passport
        repository.users.changePassword(req.params.id, req.body.oldPass, req.body.newPass, generateCallback(res, 200));
    });

};