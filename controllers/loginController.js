"use strict";
var passport = require("passport");

exports.init = function (router) {
//TODO: in auth/index.js use shortId for another token field, which is also added to user
    //check it to invalidate all logins
    router.post("/api/login", function (req, res, next) {
        passport.authenticate("local", {session: false}, function (err, userWithToken, info) {
            if (err)
                return res.customHandleError(err);
            return res.send(userWithToken);
        })(req, res, next);
    });

};