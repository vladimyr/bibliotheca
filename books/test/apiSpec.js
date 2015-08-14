var mongoose = require("mongoose");
var request = require("supertest");
var should = require("should");
var config = require("../config");

/// <reference path="../typings/tsd.d.ts" />

describe("api", function () {
    var url = "http://localhost:" + config.port;
    before(function (next) {
        mongoose.connect(config.mongoUrl);
        next();
    });
    //insert placeholder
    
    describe("users", function () {
        it("Should return JSON array", function (next) {
            request(url)
            .get("/api/users")
            .expect("Content-Type", /json/)
            .expect(200)
            .end(function (err, res) {
                if (err)
                    throw err;
                res.body.should.be.instanceOf(Array);
                next();
            });
        });
        //get by id placeholder

        //update placeholder

        //get by id again

        //delete placeholder

        //get by id again
    });
});