"use strict";
var initialBooks = require("./books.json");
var initialUsers = require("./users.json");
var repository = require("../repository");
var models = require("../models");
var hasher = require("../hasher");
var Promise = require("bluebird");
var logger = require("../logger");
Promise.promisifyAll(hasher);
Promise.promisifyAll(models.Book);
Promise.promisifyAll(models.User);

/** Seed the database and update references */
var seed = function () {
    var books, users;
    return seedDatabase(models.User, initialUsers, "users")
        .then(function () {
            logger.info("Successfully inserted users");
            return seedDatabase(models.Book, initialBooks, "books");
        })
        .then(function () {
            logger.info("Successfully inserted books");
            return models.Book.findAsync({});
        })
        .then(function (res) {
            books = res;
            return models.User.findAsync({});
        })
        .then(function (res) {
            users = res;
            return mapUserBooks(users[0], [books[0], books[1], books[2]]);
        })
        .then(function (res) {
            return mapUserBooks(users[1], [books[3], books[4], books[5]]);
        })
        //.then(function (res) {
        //    return mapUserBooks(users[0], [books[4], books[5]]);
        //})
        .then(function (res) {
            logger.info("Successfully updated references");
        })
        .catch(function (e) {
            logger.info("Global catch: " + e.message, e);//why isn't this logged to file? Why is e copying previous param?
        });
};

/** Seed the database */
var seedDatabase = function (seedModel, seedArray, seedName) {
    return seedModel.countAsync()
        .then(function (count) {
            if (count != 0)
                return Promise.reject(new Error("Collection not empty!"));
        })
        .then(function () {
            logger.info("Seeding");
            if (seedName == "users") {
                return Promise.map(seedArray, function (val) {
                    return hasher.getHashAsync(val.password)
                        .then(function (hashedPass) {
                            val.password = hashedPass;
                            return val;
                        });
                });
            } else {
                return Promise.resolve(seedArray);
            }
        })
        .then(function (res) {
            var insertAsync = Promise.promisify(seedModel.collection.insert, seedModel.collection);
            return insertAsync(res);
        });
};
/** Create references between a user and the books added */
var mapUserBooks = function (user, books) {
    user.likedBooks = books;
    return Promise.each(books, function (val) {
        val.user = user._id;
        val.likes = [user._id];
        val.likeNumber = val.likes.length;
        val.saveAsync = Promise.promisify(val.save, val);
        return val.saveAsync();
    })
        .then(function () {
            user.saveAsync = Promise.promisify(user.save, user);
            return user.saveAsync();
        });
};

seed().then(function () {
    process.exit();
});