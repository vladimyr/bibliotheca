"use strict"
var bcrypt = require("bcrypt");

exports.getHash = function (source, done) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            done(err);
        else
            bcrypt.hash(source, salt, function (err, hash) {
                if (err)
                    done(err);
                else
                    done(null, hash);
            });
    });
};

exports.compare = function (source, hash, done) {
    bcrypt.compare(source, hash, function (err, result) {
        if (err)
            done(err);
        else
            done(null, result);
    });
};
