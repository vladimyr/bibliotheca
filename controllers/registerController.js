"use strict";
var repository = require("../repository");
var generateCallback = require("../common").controllerHelper.generateCallback;

exports.init = function (router) {

    router.post("/api/register", function (req, res) {
        repository.users.getByEmail(req.body.email, function (err, user) {
            if (err)
                res.customHandleError(err);
            else if (user)
                res.sendStatus(204);
            else {
                repository.users.insert(req.body, generateCallback(res));
            }
        });
    });

};