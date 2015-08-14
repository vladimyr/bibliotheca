var mongoose = require("mongoose");

var Model = mongoose.model("User", {
    mail: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});

module.exports = Model;

/** Get all documents (populated) */
Model.getAll = function (next) {
    this.find({}).populate("books").exec(next);
};

/** Get one document by id (populated) */
Model.getById = function (id, next) {
    this.findOne({ _id: id }).populate("books").exec(next);
};