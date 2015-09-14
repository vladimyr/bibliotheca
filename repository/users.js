"use strict";
var models = require("../models");
var Promise = require("bluebird");
var hasher = require("../hasher");
Promise.promisifyAll(hasher);
var common = require("../common");

//TODO: Implement verifying logic through extensionengine email

/**
 * Get all documents (populated).
 * @param {Function} done
 * @returns {Object}
 */
exports.getAll = function (done) {
    models.User.find({}).populate("books").exec(done);
};

/**
 * Get one document by id (not populated). Throws NotFoundError if not found.
 * @param {string|number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getById = function (id, done) {
    //models.User.findOne({_id: id}).populate("books").exec(done);
    return Promise.cast(models.User.findOne({_id: id}).exec())
        .then(function (user) {
            if (!user)
                return Promise.reject(new common.errors.NotFoundError("User not found"));
            return user;
        })
        .nodeify(done);
};

/**
 * Get one document by token. Throws NotFoundError if now found
 * @param {string} token
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getByToken = function (token, done) {
    return Promise.cast(models.User.findOne({token: token}).exec())
        //.then(function (user) {
        //    if (!user)
        //        return Promise.reject(new common.errors.NotFoundError("User not found"));
        //    return user;
        //})
        .nodeify(done);
};

/**
 * Get one document by email. Returns null if no document.
 * @param {string} email Document email property
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getByEmail = function (email, done) {
    return Promise.cast(models.User.findOne({email: email}).exec())
        .nodeify(done);
};

/**
 * Inserts a new document, and returns it.
 * @param {Object} user Document to insert
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.insert = function (user, done) {
    return hasher.getHashAsync(user.password)
        .then(function (hashedPass) {
            return Promise.cast(models.User.create({email: user.email, password: hashedPass}));
        })
        .nodeify(done);
};

/**
 * Changes the password to the new value if the old value is correct. Throws NotFoundError if not found.
 * @param {string|number} id User id
 * @param {string|number} oldPass Old password
 * @param {string|number} newPass New password
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.changePassword = function (id, oldPass, newPass, done) {
    var _user;
    return Promise.cast(models.User.findOne({_id: id}).exec())
        .then(function (user) {
            if (!user)
                return Promise.reject(new common.errors.NotFoundError("No such user"));
            _user = user;
            return hasher.compareAsync(oldPass, user.password);
        })
        .then(function (result) {
            if (result === false)
                return Promise.reject(new common.errors.UnauthorizedError());
            return hasher.getHashAsync(newPass);
        })
        .then(function (hashedPass) {
            _user.password = hashedPass;
            return Promise.cast(_user.save());
        })
        .nodeify(done);
};

/**
 * Reverses admin rights on an user. Throws NotFoundError if not found.
 * @param {string|number} id User id
 * @param {Function} done
 * @returns {void}
 */
exports.reverseIsAdmin = function (id, done) {
    models.User.findOne({_id: id}, function (err, user) {
        if (err)
            done(err);
        else if (!user)
            done(new common.errors.NotFoundError("No such user"));
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