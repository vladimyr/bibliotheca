"use strict";
var repository = require("../repository");
var passport = require("passport");
var generateCallback = require("../common").controllerHelper.generateCallback;
var noSessionBearerAuth = passport.authenticate("bearer", {session: false});
var auth = require("../auth");
var emailServer = require("../emailServer");

exports.init = function (router) {

    router.get("/api/users", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        if (req.query.count) {
            repository.users.getCount(generateCallback(res));
        }
        else
            repository.users.getAll(req.query.page, req.query.perPage, generateCallback(res));
    });

    router.get("/api/users/:id", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.users.getById(req.params.id, generateCallback(res));
    });

    router.get("/api/users/:id/reverseAdmin", noSessionBearerAuth, auth.requiresAdmin, function (req, res) {
        repository.users.reverseIsAdmin(req.params.id, generateCallback(res));
    });

    router.get("/api/users/:email/changePass", function (req, res) {
        repository.users.changeForgotPassword(req.params.email, function (err, newPassAndEmail) {
            emailServer.sendNewPassMail(newPassAndEmail.email, newPassAndEmail.password);
            generateCallback(res, 200)(err, null);
        });
    });

    router.put("/api/users/:id/changePass", noSessionBearerAuth, function (req, res) {
        repository.users.changePassword(req.params.id, req.body.oldPass, req.body.newPass, generateCallback(res, 200));
    });

};