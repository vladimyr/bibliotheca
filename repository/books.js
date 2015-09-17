"use strict";
var models = require("../models");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var common = require("../common");
var users = require("./users.js");

/**
 * Get a number of documents, sorted by _id field descending (populated).
 *
 * @param {String|Number} page - Page number. Default is 1.
 * @param {String|Number} perPage - Number of items per page. Default is 10.
 * @param {Boolean} sortByLikes - If true, sorts by likes instead of _id.
 * @param {String} userId - If set, gets only books of a specific user.
 * @param done
 */
exports.getAll = function (page, perPage, sortByLikes, userId, done) {
    page = page || 1;
    perPage = perPage || 10;

    var sortObj = {_id: -1};
    if (sortByLikes) {
        sortObj = {likeNumber: -1};
    }
    if (userId) {
        users.getById(userId)
            .then(function (user) {
                return {_id: {$in: user.books}};
            })
            .then(function (findObj) {
                findBooks(findObj);
            })
            .catch(function (e) {
                done(e);
            });
    } else {
        findBooks({});
    }
    function findBooks(findObj) {
        models.Book.find(findObj)
            .sort(sortObj)
            .limit(perPage)
            .skip(perPage * (page - 1))
            .populate("user")
            .exec(done);
    }
};

/**
 * Get a count of all books in the database.
 * @param done
 */
exports.getAllCount = function (done) {
    models.Book.find({}).count(function (err, count) {
        done(err, count.toString());
    });
};

/**
 * Get one document by id (populated)
 * @param {String|Number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getById = function (id, done) {
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
        .then(findDocById(bookId, models.Book))
        .then(findDocById(userId, models.User))
        .then(getUserBooks)
        .filter(unlikeFromUser)
        .then(likeFromUserAndSave)
        .then(getBookLikes)
        .filter(unlikeFromBook)
        .then(likeFromBookAndSave)
        .then(saveUser)
        .then(changeLikeNumber)
        .then(saveBook)
        .nodeify(done);

    function findDocById(id, model) {
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

    function changeLikeNumber() {
        if (this.unlike)
            this.book.likeNumber = this.book.likeNumber - 1;
        else
            this.book.likeNumber = this.book.likeNumber + 1;
        //return Promise.cast(this.book.update({$inc: {likeNumber: 1}}).exec());
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
            book.likeNumber = book.likes.length;
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
 * Update a document by id. Affects: title, author,
 * description, pages, isbn10, isbn13, amazonUrl and imageUrl fields.
 * @param {string|number} id Document id
 * @param {Object} book Document to update
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.update = function (id, book, done) {
    models.Book.findByIdAndUpdate(id, {
        $set: {
            title: book.title,
            author: book.author,
            description: book.description,
            pages: book.pages,
            isbn10: book.isbn10,
            isbn13: book.isbn13,
            amazonUrl: book.amazonUrl,
            imageUrl: book.imageUrl
        }
    }, {"new": true}, function (err, updatedBook) {
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