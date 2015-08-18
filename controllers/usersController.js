"use strict"
//var models = require("../models");
var repository = require("../repository");

exports.init = function (router) {
    
    router.get("/api/users", function (req, res) {
        repository.users.getAll(function (err, users) {
            if (err)
                res.status(500).send(err);
            else
                res.send(users);
        });
    });

    router.get("/api/users/:id", function (req, res) {
        repository.users.getById(req.params.id, function (err, user) {
            if (err)
                res.status(500).send(err);
            else if (user === null)
                res.sendStatus(404);
            else
                res.send(user);
        });
    });
};