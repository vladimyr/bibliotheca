﻿"use strict";
var mongoose = require("mongoose");

//TODO: Add minimum password limit
var userSchema = new mongoose.Schema({
    email: {type: String, required: true, match: /.@extensionengine\.com$/i},
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    token: String,
    likedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
    rentedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
    verifyToken: String,
    verified: {type: Boolean, default: false}
});

userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.token;
        delete ret.verifyToken;
        delete ret.verified;
        delete ret.__v;
        delete ret.likedBooks;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);