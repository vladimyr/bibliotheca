var models = require("../models");

exports.getAll = function (next) {
    models.User.find({}).exec(next);
};