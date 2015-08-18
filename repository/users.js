"use strict"
var models = require("../models");
var Promise = require("bluebird");
var hasher = require("../hasher");
Promise.promisifyAll(hasher);

var NotFoundError = function (message) {
    this.name = "NotFoundError";
    this.message = message || "";
};
NotFoundError.prototype = Error.prototype;

/** Get all documents (populated) */
exports.getAll = function (done) {
    models.User.find({}).populate("books").exec(done);
};

/** Get one document by id (populated) */
exports.getById = function (id, done) {
    models.User.findOne({ _id: id }).populate("books").exec(done);
};

/** Get one document by id (populated) */
exports.getByUsername = function (username, done) {
    models.User.findOne({ username: username }).exec(done);
};

/** Inserts a new document */
exports.insert = function (user, done) {
    return hasher.getHashAsync(user.password)
    .then(function (hashedPass) {
        return Promise.cast(models.User.create({ mail: user.mail, password: hashedPass }));
    })
    .nodeify(done);
};

/** Changes the password to the new value if the old value is correct */
exports.changePassword = function (id, oldPass, newPass, done) {
    var _user;
    return Promise.cast(models.User.findOne({ _id: id }).exec())
    .then(function (user) {
        if (!user)
            return Promise.reject("No such user");
        else {
            _user = user;
            return hasher.compareAsync(oldPass, user.password);
        }
    })
    .then(function (result) {
        if (result == false)
            return Promise.reject("Wrong password");
        else
            return hasher.getHashAsync(newPass);
    })
    .then(function (hashedPass) {
        _user.password = hashedPass;
        return Promise.cast(_user.save());
    })
    .nodeify(done);
};

/** Reverses admin rights on an user */
exports.reverseIsAdmin = function (id, done) {
    models.User.findOne({ _id: id }, function (err, user) {
        if (err)
            done(err);
        else if (!user)
            done("No such user");
        else {
            if (user.isAdmin) {
                user.isAdmin = false;
            } else {
                user.isAdmin = true;
            }
            user.save();
            done(null, user);
        }
    });
};