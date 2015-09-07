"use strict";
var mongoose = require("mongoose");

var bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: String,
    pages: Number,
    isbn10: String,
    isbn13: String,
    amazonUrl: String,
    imageUrl: String,
    token: String,
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});
//TODO: Rremove likes from JSON
bookSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.__v;
        ret.likeNumber = ret.likes.length;
        return ret;
    }
});

module.exports = mongoose.model("Book", bookSchema);