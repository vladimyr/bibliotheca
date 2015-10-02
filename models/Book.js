"use strict";
var mongoose = require("mongoose");
var bookStatusEnum = require("../enums").bookStatus;

var bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: {type: String, default: ""},
    pages: {type: Number, min: 1, max: 99999, required: true},
    isbn10: {type: String, minlength: 10, maxlength: 13},
    isbn13: {type: String, minlength: 13, maxlength: 17},
    pageUrl: String,
    imageUrl: String,
    // user that added the book
    user: {type: mongoose.Schema.Types.ObjectId, required: true, ref: "User"},
    verified: {type: Boolean, default: false},
    likes: [{type: mongoose.Schema.Types.ObjectId, ref: "User"}],
    likeNumber: {type: Number, default: 0},
    status: {
        type: Number,
        enum: [bookStatusEnum.Wishlisted, bookStatusEnum.Ordered, bookStatusEnum.Available, bookStatusEnum.Rented],
        default: bookStatusEnum.Wishlisted
    },
    rentedTo: {
        user: {type: mongoose.Schema.Types.ObjectId, ref: "User"},
        date: Date
    }
});

// TODO: Add pre Hook for population
bookSchema.virtual("nextUserToRent")
    .get(function () {
        return this.likes[0] || null;
    });

bookSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.likes;
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Book", bookSchema);