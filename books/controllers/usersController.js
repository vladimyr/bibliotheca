var models = require("../models");

exports.init = function (router) {
    
    router.get("/api/users", function (req, res) {
        models.User.getAll(function (err, users) {
            if (err)
                res.status(500).send(err);
            else
                res.send(users);
        });
    });

    router.get("/api/users/:id", function (req, res) {
        models.User.getById(req.params.id, function (err, user) {
            if (err)
                res.status(500).send(err);
            else if (user === null)
                res.sendStatus(404);
            else
                res.send(user);
        });
    });
};