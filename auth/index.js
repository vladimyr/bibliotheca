"use strict"
var repository = require("../repository");
var passport = require('passport');
var localStrategy = require('passport-local').Strategy;
var bearerStrategy = require('passport-http-bearer').Strategy;
var jwt = require('jwt-simple');
var config = require("../config");

/** Middleware that rejects non-admin users */
exports.requiresAdmin = function (req, res, next) {
    if (req.user && req.user.isAdmin == true)
        next();
    else
        res.sendStatus(401);
};

/** Initialize passport and used passport strategies */
exports.init = function (app) {    
    
    passport.use("local", new localStrategy(function (username, password, next) {
        repository.users.getByUsername(username, function (err, user) {
            if (err)
                return next(err);
            if (!user)
                return next(null, false);
            if (password != user.password)
                return next(null, false);
            var token = jwt.encode({
                iss: user.id,
                exp: Date.now() + config.tokenMs
            }, config.secret);
            user.token = token;
            user.save(function (err, user) {
                if (err)
                    return next(err);
                return next(null, user);                  
            });
        });
    }));
    
    passport.use("bearer", new bearerStrategy(function (token, next) {
        var decoded;
        try {
            decoded = jwt.decode(token, config.secret);
            if (decoded.exp <= Date.now()) {
                throw new Error("Token expired");
            }
        } catch (err) {
            console.log(err);
            return next(null, false); //return unauthorized regardless of reason
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
};