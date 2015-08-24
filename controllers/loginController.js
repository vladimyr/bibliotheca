"use strict"
var passport = require("passport");

exports.init = function (router) {

    router.post("/api/login", function (req, res, next) {
        passport.authenticate("local", {session: false}, function (err, userWithToken, info) {
            if (err)
                return res.customHandleError(err);
            return res.send(userWithToken);
        })(req, res, next);
    });

};