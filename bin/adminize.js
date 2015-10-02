"use strict";

var Promise = require("bluebird");
var logger = require("../logger");
var models = require("../models");
var repository = require("../repository");


/* adminize registered as: "adminize": "node bin/adminize.js"
 should be used as: npm run adminize -- dbettini@extensionengine.com */

var seed = function (email, done) {
    return Promise.cast(models.User.findOne({email: email}).exec())
    //return repository.users.getByEmail(email)
        .then(function (user) {
            if (!user) {
                logger.info(email + " not in the database");
            }
            else if (user.isAdmin) {
                logger.info(email + " already admin");
                return user;
            }
            else {
                user.isAdmin = true;
                logger.info(email + " is now admin");
                return Promise.cast(user.save());
            }
        })
        .nodeify(done);

};

seed(process.argv[2])
    .then(function () {
        process.exit();
    })
    .catch(function (e) {
        logger.error("Global error catch: " + e.message, e);
    });
;