﻿"use strict";
var mongoose = require("mongoose");

//TODO: Add minimum password limit
var userSchema = new mongoose.Schema({
    // TODO: add regexp - match:/@extensioneengine\.com$/i
    email: {type: String, required: true},
    // TODO: minlength: 4
    password: {type: String, required: true},
    isAdmin: {type: Boolean, required: true, default: false},
    token: String,
    likedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
    rentedBooks: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
    verifyToken: String,
    verified: {type: Boolean, default: false}
});
//TODO: Remove hash from JSON
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.token;
        delete ret.verifyToken;
        delete ret.verified;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);