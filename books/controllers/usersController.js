var repository = require("../repository");

exports.init = function (router) {
    
    router.get("/api/users", function (req, res) {
        repository.users.getAll(function (err, users) {
            if (err)
                res.status(500).send(err);
            else
                res.send(users);
        });
    });

};