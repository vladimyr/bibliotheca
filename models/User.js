"use strict";
var mongoose = require("mongoose");

var userSchema = new mongoose.Schema({
    mail: {type: String, required: true},
    password: {type: String, required: true},
    isAdmin: Boolean,
    token: String,
    books: [{type: mongoose.Schema.Types.ObjectId, ref: "Book"}],
    hash: String,
    verified: Boolean
});
//TODO: Remove hash from JSON
userSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.password;
        delete ret.token;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("User", userSchema);