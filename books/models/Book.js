var mongoose = require("mongoose");

var Model = mongoose.model("Book", {
    title: { type: String, required: true },
    description: String,
    pages: Number,
    isbn10: String,
    isbn13: String,
    amazonUrl: String,
    imageUrl: String,
    user: { type: mongoose.Schema.Types.ObjectId, required: true, ref: "User" }
});

module.exports = Model;

/** Get all documents (populated) */
Model.getAll = function (next) {
    this.find({}).populate("user").exec(next);
};

/** Get one document by id (populated) */
Model.getById = function (id, next) {
    this.findOne({ _id: id }).populate("user").exec(next);
};
