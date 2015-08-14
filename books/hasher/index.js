var bcrypt = require("bcrypt");
var repository = require("../repository");

exports.getHash = function (source, next) {
    bcrypt.genSalt(10, function (err, salt) {
        if (err)
            next(err);
        else
            bcrypt.hash(source, salt, function (err, hash) {
                if (err)
                    next(err);
                else
                    next(null, hash);
            });
    });
};

exports.compare = function (source, hash, next) {
    bcrypt.compare(source, hash, function (err, result) {
        if (err)
            next(err);
        else
            next(null, result);
    });
};
