"use strict"
//var mongoose = require("mongoose");
var request = require("supertest");
var should = require("should");
var config = require("../config");
var bookData = require("./bookData.json");
var userData = require("./userData.json");

describe("/api", function () {
    var url = "http://localhost:" + config.port;
    var _user, _book;
    //before(function (done) {
    //    mongoose.connect(config.mongoUrl);
    //    done();
    //});
    describe("/users", function () {

        describe("Post", function () {
            it("Valid user provided, should return JSON object", function (done) {
                request(url)
                    .post("/api/users")
                    .send(userData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object);
                        _user = res.body;
                        done();
                    });
            });
        });
        describe("Get", function () {
            it("Should return JSON array", function (done) {
                request(url)
                    .get("/api/users")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Array);
                        done();
                    });
            });
            it("Should return JSON object", function (done) {
                request(url)
                    .get("/api/users/" + _user._id)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object);
                        done();
                    });
            });
        });
        describe("Put", function () {
            it("Wrong password provided, should return UnauthorizedError", function (done) {
                request(url)
                    .put("/api/users/" + _user._id + "/changePass")
                    .send({oldPass: userData.password + "123", newPass: "123"})
                    .expect(401)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        should.equal(res.body.name, "UnauthorizedError", "Unexpected error type");
                        done();
                    });
            });
            it("Correct password provided, should return JSON object", function (done) {
                request(url)
                    .put("/api/users/" + _user._id + "/changePass")
                    .send({oldPass: userData.password, newPass: "123"})
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object);
                        done();
                    });
            });
        });

    });
    describe("/books", function () {

        describe("Post", function () {
            it("Invalid user id provided, should return CastError", function (done) {
                var _tempBook = bookData;
                _tempBook.user = "123"
                request(url)
                    .post("/api/books")
                    .send(_tempBook)
                    .expect(404)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        should.equal(res.body.name, "CastError", "Unexpected error type");
                        done();
                    });
            });
            it("Non-existing user id provided, should return NotFoundError", function (done) {
                var _tempBook = bookData;
                _tempBook.user = "000011110000111100001111";
                request(url)
                    .post("/api/books")
                    .send(_tempBook)
                    .expect(404)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        should.equal(res.body.name, "NotFoundError", "Unexpected error type");
                        done();
                    });
            });
            it("Valid book provided, should return JSON object", function (done) {
                bookData.user = _user._id; //get this from inserted _user._id
                request(url)
                    .post("/api/books")
                    .send(bookData)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object);
                        _book = res.body;
                        done();
                    });
            });
        });
        describe("Get", function () {
            it("Should return JSON array", function (done) {
                request(url)
                    .get("/api/books")
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Array);
                        done();
                    });
            });
            it("Should return JSON object", function (done) {
                request(url)
                    .get("/api/books/" + _book._id)
                    .expect("Content-Type", /json/)
                    .expect(200)
                    .end(function (err, res) {
                        if (err)
                            throw err;
                        res.body.should.be.instanceOf(Object);
                        done();
                    });
            });
        });
        describe("Put", function () {

        });
        describe("Delete", function () {

        });

    });
});