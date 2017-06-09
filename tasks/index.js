"use strict";

var repository = require("../repository"),
    emailServer = require("../emailServer"),
    logger = require("../logger");

exports.init = function () {

    setInterval(function unverifiedBooksNotification() {
        var _count = 0;
        repository.books.getCount(null, false)
            .then(function (count) {
                _count = count;
            })
            .then(function () {
                return repository.users.getAdmins();
            })
            .each(function (admin) {
                if (_count > 0) {
                    //TODO: PRODUCTION: send mail
                    emailServer.sendUnverifiedBooksMail(admin.email);
                }
            })
            .catch(function (err) {
                logger.error(err);
            });
    }, 86400000);

};
