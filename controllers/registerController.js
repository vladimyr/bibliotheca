"use strict";
var repository = require("../repository");
var generateCallback = require("../common").controllerHelper.generateCallback;
var jwt = require("jwt-simple");
var emailServer = require("../emailServer");
var logger = require("../logger");
var config = require("../config");
var common = require("../common");

exports.init = function (router) {

    router.get("/api/register/:verifyToken", function (req, res) {
        var decoded;
        try {
            decoded = jwt.decode(req.params.verifyToken, config.secret);
            if (decoded.exp <= Date.now()) {
                throw new common.errors.TokenExpiredError("Verify token expired.");
            }
        } catch (err) {
            return res.customHandleError(err);
        }
        repository.users.verify(decoded.iss)
            .then(function (user) {
                res.send("Sucessfully verified " + user.email);
            })
            .catch(function (err) {
                res.customHandleError(err);
            });
    });

    router.post("/api/register", function (req, res) {
        repository.users.getByEmail(req.body.email, function (err, user) {
            if (err)
                res.customHandleError(err);
            else if (user) {
                handleUserExists(res, user, req.body, generateCallback(res));
                //res.sendStatus(204);
            } else {
                insertUserAndSendVerificationMail(req.body, generateCallback(res));
            }
        });
    });

};

function insertUserAndSendVerificationMail(userData, done) {
    return repository.users.insert(userData)
        .then(function (user) {
            emailServer.sendVerificationMail(user.email, user.verifyToken);
            return user;
        })
        .nodeify(done);
}

function handleUserExists(res, oldUser, newUser, done) {
    var decoded;
    try {
        decoded = jwt.decode(oldUser.verifyToken, config.secret);
    } catch (err) {
        logger.error(err);
        return res.customHandleError(err);
    }
    if (!oldUser.verified) {
        if (decoded.exp <= Date.now()) {
            repository.users.remove(oldUser._id)
                .then(function () {
                    return insertUserAndSendVerificationMail(newUser);
                })
                .nodeify(done);
        } else {
            return res.send("Verification mail already sent to " + oldUser.email);
        }
    } else
        return res.sendStatus(204);
}

// /@extensioneengine\.com$/i