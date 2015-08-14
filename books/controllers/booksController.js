var models = require("../models");

exports.init = function (router) {

    router.get("/api/books", function (req, res) {
        models.Book.getAll(function (err, books) {
            if (err)
                res.status(500).send(err);
            else
                res.send(books);
        });
    });

    router.get("/api/books/:id", function (req, res) {
        models.Book.getById(req.params.id, function (err,book) {
            if (err)
                res.status(500).send(err);
            else if (book === null)
                res.sendStatus(404);
            else
                res.send(book);
        });
    });
};