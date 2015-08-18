"use strict"
var models = require("../models");
var Promise = require("bluebird");
var mongoose = require("mongoose");

/** Get all documents (populated) */
exports.getAll = function (done) {
    models.Book.find({}).populate("user").exec(done);
};

/** Get one document by id (populated) */
exports.getById = function (id, done) {
    models.Book.findOne({ _id: id }).populate("user").exec(done);
};

/** Inserts a new document if the User field corresponds to an existing user in the database */
exports.insert = function (book, done) {
    var _user;
    book._id = new mongoose.Types.ObjectId();
    return new Promise(function (resolve, reject) {
        if (book.user === undefined)
            reject("No user provided");
        else
            resolve();
    })
    .then(function () {
        return Promise.cast(models.User.findOne({ _id: book.user }).exec())
    })
    .then(function (user) {
        if (!user)
            return Promise.reject("No such user");
        else {
            user.books.push(book._id);
            return Promise.cast(user.save());
            //return Promise.cast(models.Book.create(book));
        }
    })
    .then(function (user) {
        return Promise.cast(models.Book.create(book));
    })
    .nodeify(done);
};

/** Update a document by id */
exports.update = function (id, book, done) {
    if (book.user)
        delete book.user;
    models.Book.findByIdAndUpdate(id , book, { "new": true }, function (err, updatedBook) {
        if (err)
            done(err);
        else
            done(null, updatedBook);
    });
};

/** Delete a document by id */
exports.delete = function (id, done) {
    var _user, _book;
    //models.Book.findByIdAndRemove(id).exec(done);
    return Promise.cast(models.Book.findOne({ _id: id }).exec())
    .then(function (book) {
        if (!book)
            return Promise.reject("No such book");
        else
            return Promise.cast(book.remove());
    })
    .then(function (book) {
        _book = book;
        return Promise.cast(models.User.findOne({ _id: book.user }).exec());
    })
    .then(function (user) {
        _user = user;
        return Promise.filter(user.books, function (val) {
            if (_book.id != val)
                return val;
        });
    })
    .then(function (books) {
        _user.books = books;
        return Promise.cast(_user.save());
    })
    .nodeify(done);
};