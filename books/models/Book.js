var mongoose = require("mongoose");

module.exports = mongoose.model("Book", {
    title: { type: String, required: true },
    description: String,
    pages: Number,
    isbn10: String,
    isbn13: String,
    amazonUrl: String,
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});