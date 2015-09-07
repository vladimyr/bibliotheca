"use strict";
var models = require("../models");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var common = require("../common");

/**
 * Get all documents (populated).
 * @param done
 * @returns {Object}
 */
exports.getAll = function (done) {
    models.Book.find({}).populate("user").exec(done);
};

/**
 * Get one document by id (populated)
 * @param {string|number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getById = function (id, done) {
    //models.Book.findOne({_id: id}).populate("user").exec(done);
    return Promise.cast(models.Book.findOne({_id: id}).populate("user").exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("Book not found"));
            return book;
        })
        .nodeify(done);
};

/**
 * Return true if the user has a book liked. Otherwise, return false.
 * @param {String} bookId
 * @param {String} userId
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.isLiked = function (bookId, userId, done) {
    var _result = false;
    return Promise.cast(models.User.findOne({_id: userId}).exec())
        .then(function (user) {
            if (!user)
                return Promise.reject(new common.errors.NotFoundError("User not found"));
            return user.books;
        })
        .each(function (book) {
            if (bookId == book)
                _result = true;
        })
        .then(function () {
            return _result;
        })
        .nodeify(done);
};

/**
 * Returns an object containing the number of likes.
 * @param {String} id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getLikeNumber = function (id, done) {
    return Promise.cast(models.Book.findOne({_id: id}).exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("Book not found"));
            return {likeNumber: book.likes.length};
        })
        .nodeify(done);
};

/**
 * Likes/unlikes the book by the user:
 * If not already liked, saves the user in the book's "likes" array, and saves the book in user's "books" array.
 * If already liked, removes the user from the book's "likes" and removes the book from the user's "books".
 * @param {String} bookId
 * @param {String} userId
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.reverseLike = function (bookId, userId, done) {

    return Promise.bind({book: null, user: null, unlike: false})
        .then(findModelById(bookId, models.Book))
        .then(findModelById(userId, models.User))
        .then(getUserBooks)
        .filter(unlikeFromUser)
        .then(likeFromUserAndSave)
        .then(getBookLikes)
        .filter(unlikeFromBook)
        .then(likeFromBookAndSave)
        .then(saveUser)
        .then(saveBook)
        .nodeify(done);

    function findModelById(id, model) {
        return function query() {
            var _self = this,
                name = model.modelName.toLowerCase();

            return Promise.cast(model.findOne({_id: id}).exec())
                .then(function (doc) {
                    if (!doc)
                        return Promise.reject(new common.errors.NotFoundError(name + " not found"));
                    _self[name] = doc;
                    return doc;
                });
        };
    }

    function getUserBooks() {
        return this.user.books;
    }

    function getBookLikes() {
        return this.book.likes;
    }

    function unlikeFromUser(book) {
        if (book == this.book.id) {
            this.unlike = true;
        } else {
            return true;
        }
    }

    function likeFromUserAndSave(books) {
        this.user.books = books;
        if (!this.unlike)
            this.user.books.push(this.book._id);
    }

    function unlikeFromBook(like) {
        if (like != this.user.id)
            return true;
    }

    function likeFromBookAndSave(likes) {
        this.book.likes = likes;
        if (!this.unlike)
            this.book.likes.push(this.user._id);
    }

    function saveUser() {
        return Promise.cast(this.user.save());
    }

    function saveBook() {
        return Promise.cast(this.book.save());
    }
};

/**
 * Inserts a new document if the User field corresponds to an existing user in the database
 * @param {Object} book Document to insert
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.insert = function (book, done) {
    book._id = new mongoose.Types.ObjectId();
    book.likes = [];
    return new Promise(function (resolve, reject) {
        if (book.user === undefined)
            reject("No user provided");
        else {
            book.likes.push(book.user);
            resolve();
        }
    })
        .then(function () {
            return Promise.cast(models.User.findOne({_id: book.user}).exec())
        })
        .then(function (user) {
            if (!user)
                return Promise.reject(new common.errors.NotFoundError("User not found"));
            else {
                user.books.push(book._id);
                return Promise.cast(user.save());
            }
        })
        .then(function (user) {
            return Promise.cast(models.Book.create(book));
        })
        .nodeify(done);
};

/**
 * Update a document by id
 * @param {string|number} id Document id
 * @param {Object} book Document to update
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.update = function (id, book, done) {
    if (book.user)
        delete book.user;
    models.Book.findByIdAndUpdate(id, book, {"new": true}, function (err, updatedBook) {
        if (err)
            done(err);
        else if (!updatedBook)
            done(new common.errors.NotFoundError("Book not found"));
        else
            done(null, updatedBook);
    });
};

/**
 * Delete a document by id
 * @param {string|number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.delete = function (id, done) {
    var _user, _book;
    //models.Book.findByIdAndRemove(id).exec(done);
    return Promise.cast(models.Book.findOne({_id: id}).exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("Book not found"));
            else
                return Promise.cast(book.remove());
        })
        .then(function (book) {
            _book = book;
            return Promise.cast(models.User.findOne({_id: book.user}).exec());
        })
        .then(function (user) {
            _user = user;
            return Promise.filter(user.books, function (val) {
                if (_book.id != val)
                    return true;
            });
        })
        .then(function (books) {
            _user.books = books;
            return Promise.cast(_user.save());
        })
        .nodeify(done);
};