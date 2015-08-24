"use strict"
var repository = require("../repository");

exports.init = function (router) {

    router.post("/api/register", function (req, res) {
        repository.users.getByMail(req.body.mail, function (err, user) {
            if (err)
                res.customHandleError(err);
            else if (user)
                res.sendStatus(204);
            else {
                if (req.body.isAdmin)
                    delete req.body.isAdmin;
                repository.users.insert(req.body, function (err, user) {
                    if (err)
                        res.customHandleError(err);
                    else
                        res.status(200).send(user);
                });
            }
        });
    });

};