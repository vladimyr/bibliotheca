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
    // user that added the book
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    verified: {type: Boolean, default: false},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    likeNumber: {type: Number, default: 0},
    // 0-wishlist, 1-ordered, 2-available, 3-rented
    //TODO: check for mongoose enum (custom type,e.g.BookNumber);otherwise write enum
    status: {type: Number, min: 0, max: 3, default: 0},
    rentedTo: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
    rentedDate: Date,
    rentQueue: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}]
});
//TODO: Rremove likes from JSON
bookSchema.set("toJSON", {
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Book", bookSchema);