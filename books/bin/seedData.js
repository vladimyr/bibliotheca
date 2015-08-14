var initialBooks = require("./books.json");
var initialUsers = require("./users.json");
var models = require("../models");
var hasher = require("../hasher");
var Promise = require("bluebird");
Promise.promisifyAll(hasher);
Promise.promisifyAll(models.Book);
Promise.promisifyAll(models.User);

/** Seed the database and update references */
var seed = function () {
    var books, users;
    return seedDatabase(models.User, initialUsers, "users")
    .then(function () {
        console.log("Successfully inserted users");
        return seedDatabase(models.Book, initialBooks, "books");
    })
    .then(function () {
        console.log("Successfully inserted books");
        return models.Book.findAsync({});
    })
    .then(function (res) {
        books = res;
        return models.User.findAsync({});
    })
    .then(function (res) {
        users = res;
        return mapUserBooks(users[0], [books[0], books[1]]);
    })
    .then(function (res) {
        console.log("Successfully updated references");
    })
    .catch(function (e) {
        console.log("Global catch: " + e);
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
        console.log("Seeding");
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
    //.each(function (val, index) {
    //    if (seedName == "users")
    //        seedArray[index].password = val;
    //})
    .then(function (res) {
        var insertAsync = Promise.promisify(seedModel.collection.insert, seedModel.collection);
        return insertAsync(res);
    });
};
/** Create references between a user and the books he added */
var mapUserBooks = function (user, books) {
    user.books = books;
    return Promise.each(books, function (val) {
        val.user = user._id;
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