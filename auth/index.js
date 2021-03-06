﻿"use strict";

var repository = require("../repository");
var passport = require("passport");
var LocalStrategy = require("passport-local").Strategy;
var BearerStrategy = require("passport-http-bearer").Strategy;
var jwt = require("jwt-simple");
var config = require("../config");
var hasher = require("../hasher");
var Promise = require("bluebird");
var common = require("../common");
var logger = require("../logger");
Promise.promisifyAll(hasher);

/** Middleware that rejects non-admin users */
exports.requiresAdmin = function (req, res, next) {
    if (req.user && req.user.isAdmin === true)
        next();
    else
        res.sendStatus(401);
};

/** Initialize passport and used passport strategies */
exports.init = function (app) {

    passport.use("local", new LocalStrategy({usernameField: "email"}, function (email, password, next) {
        return repository.users.getByEmail(email)
            .bind({})
            .then(function (user) {
                if (!user) {
                    return Promise.reject(new common.errors.NotFoundError());
                } else if (!user.verified) {
                    return Promise.reject(new common.errors.ForbiddenError("User not verified."));
                } else {
                    this.user = user;
                    return hasher.compareAsync(password, user.password);
                }
            })
            .then(function (res) {
                if (res) {
                    var token = jwt.encode({
                        iss: this.user.id,
                        exp: Date.now() + config.tokenMs
                    }, config.secret);
                    this.user.token = token;
                    this.token = token;
                    return Promise.cast(this.user.save());
                } else {
                    return Promise.reject(new common.errors.NotFoundError());
                }
            })
            .then(function (user) {
                return {
                    _id: user._id,
                    email: user.email,
                    token: this.token,
                    isAdmin: user.isAdmin
                };
            })
            .nodeify(next);
    }));

    passport.use("bearer", new BearerStrategy(function (token, next) {
        var decoded;
        try {
            decoded = jwt.decode(token, config.secret);
            if (decoded.exp <= Date.now()) {
                throw new Error("Token expired");
            }
        } catch (err) {
            logger.error(err);
            return next(null, false);
        }
        repository.users.getByToken(token, function (err, user) {
            if (err)
                return next(err);
            if (!user || !user.verified)
                return next(null, false);
            return next(null, user);
        });
    }));

    app.use(passport.initialize());
    logger.log("info", "Passport initialized");
};
