"use strict"
var mongoose = require("mongoose");
var request = require("supertest");
var should = require("should");
var bookData = require("./bookData.json");
var userData = require("./userData.json");
var config = require("../config");
var models = require("../models");

describe("/api", function () {
    var url = "http://localhost:" + config.port;
    var _user, _book;
    var _randomId = "000011110000111100001111";
    describe("/users", function () {
        var userUrl = "/api/users/";
        describe("Post", function () {
            it("Valid user provided, should return user as JSON object", function (done) {
                request(url)
                    .post(userUrl)
                    .send(userData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        _user = res.body;
                        done();
                    });
            });
        });
        describe("Get", function () {
            it("Should return users as JSON array", function (done) {
                request(url)
                    .get(userUrl)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {

                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Array);
                        res.body[0].should.have.properties(["mail", "books"]);
                        done();
                    });
            });
            it("Should return user as JSON object", function (done) {
                request(url)
                    .get(userUrl + _user._id)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        done();
                    });
            });
            it("Should return user as JSON object with isAdmin property true", function (done) {
                request(url)
                    .get(userUrl + _user._id + "/reverseAdmin")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books", "isAdmin"]);
                        res.body.isAdmin.should.be.true();
                        done();
                    });
            });
            it("Should return JSON object with isAdmin property false", function (done) {
                request(url)
                    .get(userUrl + _user._id + "/reverseAdmin")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books", "isAdmin"]);
                        res.body.isAdmin.should.be.false();
                        done();
                    });
            });
        });
        describe("Put", function () {
            it("Wrong password provided, should return UnauthorizedError", function (done) {
                request(url)
                    .put(userUrl + _user._id + "/changePass")
                    .send({oldPass: userData.password + "123", newPass: "123"})
                    .expect(401)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        should.equal(res.body.name, "UnauthorizedError", "Unexpected error type");
                        done();
                    });
            });
            it("Correct password provided, should return 200 OK", function (done) {
                request(url)
                    .put(userUrl + _user._id + "/changePass")
                    .send({oldPass: userData.password, newPass: "123"})
                    .expect("Content-Type", /text/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        //res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        res.body.should.be.empty();
                        done();
                    });
            });
        });

    });
    describe("/books", function () {
        var bookUrl = "/api/books/";
        describe("Post", function () {
            it("Invalid user field provided, should return status 500", function (done) {
                var _tempBook = bookData;
                _tempBook.user = "123"
                request(url)
                    .post(bookUrl)
                    .send(_tempBook)
                    .expect(500)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        done();
                    });
            });
            it("Non-existing user field provided, should return NotFoundError", function (done) {
                var _tempBook = bookData;
                _tempBook.user = _randomId;
                request(url)
                    .post(bookUrl)
                    .send(_tempBook)
                    .expect(404)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        should.equal(res.body.name, "NotFoundError", "Unexpected error type");
                        done();
                    });
            });
            it("Valid book object provided, should return JSON object", function (done) {
                bookData.user = _user._id;
                request(url)
                    .post(bookUrl)
                    .send(bookData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["title", "user"]);
                        _book = res.body;
                        done();
                    });
            });
        });
        describe("Get", function () {
            it("Should return books as JSON array", function (done) {
                request(url)
                    .get(bookUrl)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Array);
                        res.body[0].should.have.properties(["title", "user"]);
                        done();
                    });
            });
            it("Should return JSON object", function (done) {
                request(url)
                    .get(bookUrl + _book._id)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["title", "user"]);
                        done();
                    });
            });
        });
        describe("Put", function () {
            it("Valid book object provided, should return JSON object", function (done) {
                request(url)
                    .put(bookUrl + _book._id)
                    .send(bookData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["title", "user"]);
                        _book = res.body;
                        done();
                    });
            });
        });
        describe("Delete", function () {
            it("Valid id provided, should return 200 OK", function (done) {
                request(url)
                    .delete(bookUrl + _book._id)
                    .expect("Content-Type", /text/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.empty();
                        done();
                    });
            });
        });

    });
    after("Deleting inserted user", function (done) {
        mongoose.connect(config.mongoUrl);
        models.User.findByIdAndRemove(_user._id).exec(done);
    });
});