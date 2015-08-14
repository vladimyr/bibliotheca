var mongoose = require("mongoose");

module.exports = mongoose.model("User", {
    mail: { type: String, required: true },
    password: { type: String, required: true },
    isAdmin: Boolean,
    books: [{ type: mongoose.Schema.Types.ObjectId, ref: "Book" }]
});