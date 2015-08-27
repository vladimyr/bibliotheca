"use strict";

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

    passport.use("local", new LocalStrategy({usernameField: "mail"}, function (mail, password, next) {
        return repository.users.getByMail(mail)
            .bind({})
            .then(function (user) {
                if (!user) {
                    return Promise.reject(new common.errors.NotFoundError());
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
                this.user = user;
                return this;
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
            console.log(err);
            return next(null, false);
        }
        repository.users.getByToken(token, function (err, user) {
            if (err)
                return next(err);
            if (!user)
                return next(null, false);
            return next(null, user);
        });
    }));

    app.use(passport.initialize());
    logger.log("info", "Passport initialized");
};
