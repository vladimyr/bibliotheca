"use strict";
var mongoose = require("mongoose");
var request = require("supertest");
var should = require("should");
var bookData = require("./bookData.json");
var userData = require("./userData.json");
var config = require("../config");
var models = require("../models");

describe("/api", function () {
    var url = config.apiUrl;
    var _user, _book, _token;
    var _randomId = "000011110000111100001111";
    describe("/register", function () {
        var registerUrl = "/register";
        describe("Post", function () {
            it("Valid user provided, should return user as JSON object", function (done) {
                request(url)
                    .post(registerUrl)
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
            it("Existing user mail provided, should return 204 No Response", function (done) {
                request(url)
                    .post(registerUrl)
                    .send(userData)
                    .expect(204)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.empty();
                        done();
                    });
            });
        });
    });
    describe("/login", function () {
        var loginUrl = "/login";
        describe("Post", function () {
            it("Incorrect mail provided, should return 404 Not Found", function (done) {
                request(url)
                    .post(loginUrl)
                    .send({mail: "abcdefgh", password: "1234"})
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        //res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        done();
                    });
            });
            it("Incorrect password provided, should return 404 Not Found", function (done) {
                request(url)
                    .post(loginUrl)
                    .send({mail: userData.mail, password: "0000"})
                    .expect("Content-Type", /json/)
                    .expect(404)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        //res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        done();
                    });
            });
            it("Correct credentials provided, should return JSON object with user and token fields", function (done) {
                request(url)
                    .post(loginUrl)
                    .send(userData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["user", "token"]);
                        _token = res.body.token;
                        done();
                    });
            });
        });
    });
    describe("/users", function () {
        var userUrl = "/users/";
        describe("Get", function () {
            //it("Should return 401 Unauthorized because of missing Authorization header", function (done) {
            //    request(url)
            //        .get(userUrl)
            //        .expect(401)
            //        .end(function (err, res) {
            //            if (err)
            //                throw err;
            //            res.body.should.be.empty();
            //            done();
            //        });
            //});
            it("Should return users as JSON array", function (done) {
                request(url)
                    .get(userUrl)
                    .set("Authorization", "bearer " + _token)
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
                    .set("Authorization", "bearer " + _token)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object).and.have.properties(["mail", "books"]);
                        done();
                    });
            });
        });
        describe("/reverseAdmin", function () {
            describe("Get", function () {
                it("Should return user as JSON object with isAdmin property true", function (done) {
                    request(url)
                        .get(userUrl + _user._id + "/reverseAdmin")
                        .set("Authorization", "bearer " + _token)
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
                        .set("Authorization", "bearer " + _token)
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
        });
        describe("/changePass", function () {
            describe("Put", function () {
                it("Wrong password provided, should return UnauthorizedError", function (done) {
                    request(url)
                        .put(userUrl + _user._id + "/changePass")
                        .set("Authorization", "bearer " + _token)
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
                        .set("Authorization", "bearer " + _token)
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

    });
    describe("/books", function () {
        var bookUrl = "/books/";
        describe("Post", function () {
            it("Valid book object provided, should return JSON object", function (done) {
                bookData.user = _user._id;
                request(url)
                    .post(bookUrl)
                    .set("Authorization", "bearer " + _token)
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
                    .set("Authorization", "bearer " + _token)
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
                    .set("Authorization", "bearer " + _token)
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
                    .set("Authorization", "bearer " + _token)
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
        describe("/like", function () {
            describe("Get", function () {
                it("Should return true because user has the book liked", function (done) {
                    request(url)
                        .get(bookUrl + _book._id + "/like")
                        .set("Authorization", "bearer " + _token)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.body.should.equal(true);
                            done();
                        });
                });
            });
            describe("Put", function () {
                it("Should return book as JSON object with empty 'likes' array", function (done) {
                    request(url)
                        .put(bookUrl + _book._id + "/like")
                        .set("Authorization", "bearer " + _token)
                        .send(bookData)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.body.should.be.instanceOf(Object).and.have.properties(["title", "user", "likes"]);
                            res.body.likes.should.be.instanceOf(Array).and.be.empty();
                            done();
                        });
                });
            });
            describe("Get", function () {
                it("Should return false because user has unliked the book", function (done) {
                    request(url)
                        .get(bookUrl + _book._id + "/like")
                        .set("Authorization", "bearer " + _token)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.body.should.equal(false);
                            done();
                        });
                });
            });
            describe("Put", function () {
                it("Should return book as JSON object with the userId in the 'likes' array", function (done) {
                    request(url)
                        .put(bookUrl + _book._id + "/like")
                        .set("Authorization", "bearer " + _token)
                        .send(bookData)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.body.should.be.instanceOf(Object).and.have.properties(["title", "user", "likes"]);
                            res.body.likes.should.be.instanceOf(Array);
                            res.body.likes[0].should.equal(_user._id);
                            done();
                        });
                });
            });
            describe("Get", function () {
                it("Should return true because user has liked the book again", function (done) {
                    request(url)
                        .get(bookUrl + _book._id + "/like")
                        .set("Authorization", "bearer " + _token)
                        .expect("Content-Type", /json/)
                        .expect(200)
                        .end(function (err, res) {
                            if (err)
                                throw err;
                            res.body.should.equal(true);
                            done();
                        });
                });
            });
        });
        describe("Delete", function () {
            it("Valid id provided, should return 200 OK", function (done) {
                request(url)
                    .delete(bookUrl + _book._id)
                    .set("Authorization", "bearer " + _token)
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