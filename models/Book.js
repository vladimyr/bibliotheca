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
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    likeNumber: {type: Number, default: 0}
});
//TODO: Rremove likes from JSON
bookSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Book", bookSchema);