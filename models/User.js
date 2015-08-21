﻿"use strict"
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    mail: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: Boolean,
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}]
});

userSchema.set("toJSON", {
    transform: function(doc, ret, options) {
        delete ret.password;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);

///** Get all documents (populated) */
//Model.getAll = function (next) {
//    this.find({}).populate("books").exec(next);
//};

///** Get one document by id (populated) */
//Model.getById = function (id, next) {
//    this.findOne({ _id: id }).populate("books").exec(next);
//};