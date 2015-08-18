"use strict"
var mongoose = require("mongoose");
var User = require("./User.js");
var Promise = require("bluebird");

var Model = mongoose.model("Book", {
    title: { type: String, required: true },
    description: String,
    pages: Number,
    isbn10: String,
    isbn13: String,
    amazonUrl: String,
    imageUrl: String,
    token: String,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = Model;

///** Get all documents (populated) */
//Model.getAll = function (next) {
//    this.find({}).populate("user").exec(next);
//};

///** Get one document by id (populated) */
//Model.getById = function (id, next) {
//    this.findOne({ _id: id }).populate("user").exec(next);
//};

///** Inserts a new document if the User field corresponds to an existing user in the database */
//Model.insert = function (book, next) {
//    return new Promise(function (resolve, reject) {
//        if (book.user === undefined)
//            reject("No user provided");
//        else
//            resolve();
//    })
//    .then(function () {
//        return Promise.cast(User.findOne({ _id: book.user }).exec())
//    })
//    .then(function (user) {
//        if (!user)
//            return Promise.reject("No such user");
//        else
//            return Promise.cast(Model.create(book));
//    })
//    .nodeify(next);
//};

///** Update a document by id */
//Model.updateBook = function (id, book, next) {
//    delete book.user;
//    Model.findByIdAndUpdate(id , book, { "new": true }, function (err, updatedBook) {
//        if (err)
//            next(err);
//        else
//            next(null, updatedBook);
//    });
//};

///** Delete a document by id */
//Model.delete = function (id, next) {
//    Model.findByIdAndRemove(id).exec(next);
//};