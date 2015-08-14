var models = require("../models");

exports.getAll = function (next) {
    models.Book.find({}).exec(next);
};