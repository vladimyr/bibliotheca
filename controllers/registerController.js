"use strict";
var repository = require("../repository");
var generateCallback = require("../common").controllerHelper.generateCallback;
//var emailServer = require("../emailServer");

exports.init = function (router) {

    router.post("/api/register", function (req, res) {
        repository.users.getByEmail(req.body.email, function (err, user) {
            if (err)
                res.customHandleError(err);
            else if (user) {
                //TODO: check verification
                //handleUserExists(res,user);
                res.sendStatus(204);
            } else {
                repository.users.insert(req.body, function (err, result) {
                        if (err)
                            res.customHandleError(err);
                        else {
                            res.send(result);
                        }
                    }
                );
            }
        });
    });

};

//function handleUserExists(res, user) {
//    if (!isVerified) {
//        if (hashExpired) {
//            changePass();
//            getNewHash();
//                res.send(200);
//        } else {
//            res.send(verificationMailHasBeenSent);
//        }
//    } else
//        res.sendStatus(204);
//}

// /@extensioneengine\.com$/i