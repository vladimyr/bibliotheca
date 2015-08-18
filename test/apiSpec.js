"use strict"
var mongoose = require("mongoose");
var request = require("supertest");
var should = require("should");
var config = require("../config");

describe("api", function () {
    var url = "http://localhost:" + config.port;
    //before(function (done) {
    //    mongoose.connect(config.mongoUrl);
    //    done();
    //});
    //insert placeholder

    describe("users", function () {
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
        //get by id placeholder

        //update placeholder

        //get by id again

        //delete placeholder

        //get by id again
    });
});