"use strict";
var models = require("../models");
var Promise = require("bluebird");
var mongoose = require("mongoose");
var common = require("../common");
var users = require("./users.js");
var bookStatusEnum = require("../enums").bookStatus;
var logger = require("../logger");

/**
 * Get a number of verified books, sorted by _id field descending (populated). *
 * @param {String|Number} page - Page number. Default is 1.
 * @param {String|Number} perPage - Number of items per page. Default is 10.
 * @param {Boolean} sortByLikes - If true, sorts by likes instead of _id.
 * @param {String} userId - If set, gets only books of a specific user.
 * @param done
 */
exports.getAll = function (page, perPage, sortByLikes, userId, done) {
    page = (parseInt(page, 10) && page > 0) ? page : 1;
    perPage = (parseInt(perPage, 10) && perPage > 0) ? perPage : 10;

    var findObj = {verified: true};
    // default: sort by id descending
    var sortObj = [["_id", -1]];
    if (sortByLikes) {
        //sort by id ascending and then by likeNumber descending
        sortObj = [["likeNumber", -1], ["_id", 1]];
    }
    if (userId) {
        users.getById(userId)
            .then(function (user) {
                findObj._id = {$in: user.likedBooks};
                return findObj;
            })
            .then(function (findObj) {
                return findBooks(findObj, done);
            });
        //.catch(function (e) {
        //    done(e);
        //})

    } else {
        return findBooks(findObj, done);
    }

    function findBooks(findObj, done) {
        return Promise.cast(models.Book.find(findObj)
            .sort(sortObj)
            .limit(perPage)
            .skip(perPage * (page - 1))
            .populate("likes")
            .populate("rentedTo.user")
            .exec())
            .nodeify(done);
    }
};

/**
 * Get all unverified books, sorted by _id field descending.
 * @param done
 * @returns {*}
 */
exports.getAllUnverified = function (done) {
    var sortObj = [["_id", 1]],
        findObj = {verified: false};

    return Promise.cast(models.Book.find(findObj)
        .sort(sortObj)
        .populate("user")
        .exec())
        .nodeify(done);
};

/**
 * Get a count of verified books in the database.
 * @param userId
 * @param done
 */
exports.getCount = function (userId, done) {
    var findObj = {verified: true};
    if (userId) {
        users.getById(userId)
            .then(function (user) {
                findObj._id = {$in: user.likedBooks};
                return findObj;
            })
            .then(function (findObj) {
                return getBookCount(findObj, done);
            });
        //.catch(function (e) {
        //    done(e);
        //})
    } else {
        return getBookCount(findObj, done);
    }

    function getBookCount(findObj, done) {
        //models.Book.find(findObj)
        //    .count(function (err, count) {
        //        done(err, count.toString());
        //    });
        return Promise.cast(models.Book.find(findObj)
            .count()
            .exec())
            .then(function (count) {
                return count.toString();
            })
            .nodeify(done);
    }
};

/**
 * Get one document by id (populated)
 * @param {String|Number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.getById = function (id, done) {
    return Promise.cast(models.Book.findOne({_id: id}).populate("likes").populate("rentedTo.user").exec())
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
            return user.likedBooks;
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
 * If not already liked, saves the user in the book's "likes" array, and saves the book in user's "likedBooks" array.
 * If already liked, removes the user from the book's "likes" and removes the book from the user's "likedBooks".
 * @param {String} bookId
 * @param {String} userId
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.reverseLike = function (bookId, userId, done) {

    return Promise.bind({book: null, user: null, unlike: false})
        .then(findDocById(bookId, models.Book))
        .then(findDocById(userId, models.User))
        .then(getUserLikedBooks)
        .filter(filterRemoveLikedBookFromUser)
        .then(likeFromUserAndSet)
        .then(getBookLikes)
        .filter(filterRemoveUserLikeFromBook)
        .then(likeFromBookAndSet)
        .then(saveUser)
        .then(changeLikeNumber)
        .then(saveBook)
        .nodeify(done);

    /**
     * Finds a document, returns it, and sets this[modelName] to it.
     * @param id
     * @param model
     * @returns {Function}
     */
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

    /**
     * Get all books from this.user's likedBooks array.
     * @returns {Array|*}
     */
    function getUserLikedBooks() {
        return this.user.likedBooks;
    }

    /**
     * Get all users from this.book's likes array.
     * @returns {*}
     */
    function getBookLikes() {
        return this.book.likes;
    }

    /**
     * FILTER FUNCTION. Checks a specified bookId against this.book.id. If a match is found,
     * sets this.unlike to true and doesn't return. Else, returns true.
     * @param book
     * @returns {boolean}
     */
    function filterRemoveLikedBookFromUser(bookId) {
        if (bookId == this.book.id) {
            this.unlike = true;
        } else {
            return true;
        }
    }

    /**
     * Set this.user.likedBooks to specified likedBooks. If this.unlike is not
     * true, push this.book._id into this.user.likedBooks.
     * @param likedBooks
     */
    function likeFromUserAndSet(likedBooks) {
        this.user.likedBooks = likedBooks;
        if (!this.unlike)
            this.user.likedBooks.push(this.book._id);
    }

    /**
     * FILTER FUNCTION. Checks a specified userId against this.user.id. If a match is found,
     * doesn't return. Else, returns true.
     * @param like
     * @returns {boolean}
     */
    function filterRemoveUserLikeFromBook(userId) {
        if (userId != this.user.id)
            return true;
    }

    /**
     * Set this.book.likesto specified likes. If this.unlike is not
     * true, push this.user._id into this.user.likes.
     * @param likes
     */
    function likeFromBookAndSet(likes) {
        this.book.likes = likes;
        if (!this.unlike)
            this.book.likes.push(this.user._id);
    }

    /**
     * Save the user and return the saved document.
     * @returns {Object}
     */
    function saveUser() {
        return Promise.cast(this.user.save());
    }

    /**
     * Increments this.book.likeNumber if this.unlike is false.
     * Decrements it otherwise.
     */
    function changeLikeNumber() {
        if (this.unlike)
            this.book.likeNumber = this.book.likeNumber - 1;
        else
            this.book.likeNumber = this.book.likeNumber + 1;
    }

    /**
     * Save the book and return the saved document.
     * @returns {Object}
     */
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
exports.insert = function (book, userId, done) {
    book._id = new mongoose.Types.ObjectId();
    book.likes = [];

    return Promise.cast(models.User.findOne({_id: userId}).exec())
        .then(function (user) {
            if (!user)
                return Promise.reject(new common.errors.NotFoundError("User not found"));
            else {
                book.likes.push(user._id);
                book.likeNumber = book.likes.length;
                user.likedBooks.push(book._id);
                return Promise.cast(user.save());
            }
        })
        .then(function (user) {
            return Promise.cast(models.Book.create({
                _id: book._id,
                title: book.title,
                author: book.author,
                description: book.description,
                pages: book.pages,
                isbn10: book.isbn10,
                isbn13: book.isbn13,
                pageUrl: book.pageUrl,
                imageUrl: book.imageUrl,
                user: userId,
                likes: book.likes,
                likeNumber: book.likeNumber
            }));
        })
        .nodeify(done);
};

/**
 * Update a document by id. Affects: title, author,
 * description, pages, isbn10, isbn13, pageUrl and imageUrl fields.
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
            pageUrl: book.pageUrl,
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
 * Delete a book by id. Look into its likes array and remove it
 * from every user's likedBooks and rentedBooks
 * @param {string|number} id Document id
 * @param {Function} done
 * @returns {Promise<R>}
 */
exports.delete = function (id, done) {
    // TODO: (maybe) find user by rentedTo.user and delete from his current reading book
    var _book;
    return Promise.cast(models.Book.findOne({_id: id}).exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("Book not found"));
            else
                return Promise.cast(book.remove());
        })//
        .then(function (book) {
            _book = book;
            return book.likes;
        })
        .each(function (userId) {
            return Promise.bind({user: null})
                .then(function () {
                    return Promise.cast(models.User.findOne({_id: userId}).exec())
                })
                .then(function (user) {
                    if (!user)
                        return Promise.reject(new common.errors.NotFoundError("User not found"));
                    else {
                        this.user = user;
                        return user.likedBooks;
                    }
                })
                .filter(function (val) {
                    if (_book.id != val)
                        return true;
                })
                .then(function (likedBooks) {
                    this.user.likedBooks = likedBooks;
                    return this.user.rentedBooks;
                })
                .filter(function (val) {
                    if (_book.id != val)
                        return true;
                })
                .then(function (rentedBooks) {
                    this.user.rentedBooks = rentedBooks;
                    return Promise.cast(this.user.save());
                })
                .catch(function (err) {
                    logger.error(err);
                })
        })
        .nodeify(done);
};

/**
 * Update the status of a verified book. Can not be used to rent a book.
 * @param id
 * @param status
 * @param done
 * @returns {Promise<R>}
 */
exports.updateStatus = function (id, status, done) {
    //TODO: fix validation, it's not checking for some reason
    return Promise.cast(models.Book.findOne({_id: id, verified: true}).exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("Book not found"));
            else {
                return book;
            }
        })
        .then(function (book) {
            var cond1 = book.status === bookStatusEnum.Wishlisted || book.status === bookStatusEnum.Ordered,
                cond2 = status === bookStatusEnum.Wishlisted || status === bookStatusEnum.Ordered || status === bookStatusEnum.Available;
            if (cond1 && cond2) {
                book.status = status;
                return Promise.cast(book.save());
            } else {
                return Promise.reject(new common.errors.ForbiddenError("Forbidden."));
            }
        })
        .nodeify(done);
};

/**
 * Rents verified book to the next user in the "likes" array, and sets status to "Rented". If
 * the array is empty, sets status to "Available".
 * @param bookId
 * @param done
 * @returns {*}
 */
exports.rentNext = function (bookId, done) {
    var _date = new Date(Date.now());
    var userId = {};
    var userOldId = {};
    var notRented = false;
    return Promise.bind({book: null, user: null})
        .then(findDocById(bookId, models.Book))
        .then(function () {
            if (this.book.status == bookStatusEnum.Rented) {
                userOldId = this.book.rentedTo.user;
                return true;
            } else
                return false;
        })
        .then(function (shouldRemoveFromOldUser) {
            if (shouldRemoveFromOldUser)
                return Promise.bind(this)
                    .then(findDocById(userOldId, models.User))
                    .then(function getUserRentedBooks() {
                        return this.user.rentedBooks;
                    })
                    .filter(function filterRemoveRentedBookFromUser(bookId) {
                        if (bookId != this.book.id)
                            return true;
                    })
                    .then(function setUserRentedBooks(rentedBooks) {
                        this.user.rentedBooks = rentedBooks;
                    })
                    .then(function saveUser() {
                        return Promise.cast(this.user.save());
                    });
        })
        .then(function () {
            if (this.book.status === bookStatusEnum.Available && this.book.likes.length > 0) {
                userId = this.book.likes[0];
                this.book.status = bookStatusEnum.Rented;
                this.book.rentedTo = {
                    user: userId,
                    date: _date
                };
            } else if (this.book.status === bookStatusEnum.Rented) {
                if (this.book.likes.length == 0) {
                    notRented = true;
                    this.book.status = bookStatusEnum.Available;
                } else {
                    userId = this.book.likes[0];
                    this.book.rentedTo = {
                        user: userId,
                        date: _date
                    };
                }
            } else {
                return Promise.reject(new common.errors.ForbiddenError("Forbidden."));
            }
        })
        .then(function rentToNewUser() {
            if (!notRented)
                return Promise.bind(this)
                    .then(findDocById(this.book.rentedTo.user, models.User))
                    .then(function rentFromUserAndSet() {
                        this.user.rentedBooks.push(this.book._id);
                    })
                    .then(function () {
                        return Promise.cast(this.user.save());
                    });
        })
        .then(function () {
            return Promise.cast(this.book.save());
        })
        .then(function (book) {
            if (notRented)
                done(null, book);
            else
                return exports.reverseLike(bookId, userId.toString(), done);
        })
        .catch(function (err) {
            done(err);
        });

    /**
     * Finds a document, returns it, and sets this[modelName] to it.
     * @param id
     * @param model
     * @returns {Function}
     */
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
};

/**
 * Verify the book. Return ForbiddenError if the book is already verified.
 * @param id
 * @param done
 * @returns {Promise<R>}
 */
exports.verify = function (id, done) {
    return Promise.cast(models.Book.findOne({_id: id}).exec())
        .then(function (book) {
            if (!book)
                return Promise.reject(new common.errors.NotFoundError("No such book"));
            else if (book.verified)
                return Promise.reject(new common.errors.ForbiddenError("Book already verified"));
            else {
                book.verified = true;
                return Promise.cast(book.save());
            }
        })
        .nodeify(done);
};