"use strict";
var mongoose = require("mongoose");
var bookStatusEnum = require("../enums").bookStatus;

var bookSchema = new mongoose.Schema({
    title: {type: String, required: true},
    author: {type: String, required: true},
    description: {type: String, default: ""},
    pages: Number,
    // TODO: minlength:10,maxlength:13
    isbn10: String,
    // TODO: minlength:13,maxlength:17
    isbn13: String,
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
//bookSchema.virtual("likeNumber")
//    .get(function () {
//        return this.likes.length;
//    });
// TODO: Add pre Hook for population
bookSchema.virtual("nextUserToRent")
    .get(function(){
       return this.likes[0] || null;
    });
//TODO: Rremove likes from JSON
bookSchema.set("toJSON", {
    virtuals: true,
    transform: function (doc, ret, options) {
        delete ret.__v;
        return ret;
    }
});

module.exports = mongoose.model("Book", bookSchema);