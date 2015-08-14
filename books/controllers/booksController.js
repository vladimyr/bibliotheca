var repository = require("../repository");

exports.init = function (router) {

    router.get("/api/books", function (req, res) {
        repository.books.getAll(function (err, books) {
            if (err)
                res.status(500).send(err);
            else
                res.send(books);
        });
    });

};