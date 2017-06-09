/* eslint-env node, mocha */

const request = require("supertest");
const should = require("should/as-function");
const HttpStatus = require("http-status");
const Users = require("../repository").users;
const url = require("../config").apiUrl;

const shouldBeUser = obj => {
    should(obj).be.an.Object()
        .and.have.properties(["email", "isAdmin", "token"]);
};

describe("POST /login", () => {
    let user;
    const email = "test@extensionengine.com";
    const password = "test1234";

    before(() => {
        return Users.insert({ email, password })
            .then(model => {
                user = model;
                return Users.verify(user.id);
            });
    });

    it("Should fail if incorrect email is provided", () => {
        return request(url)
            .post("/login")
            .send({ email: "dummy@extensionengine.com", password })
            .expect("Content-Type", /json/)
            .expect(HttpStatus.NOT_FOUND);
    });

    it("Should fail if incorrect password is provided", () => {
        return request(url)
            .post("/login")
            .send({ email, password: "test0000" })
            .expect("Content-Type", /json/)
            .expect(HttpStatus.NOT_FOUND);
    });

    it("Should let you in using valid credentials", done => {
        request(url)
            .post("/login")
            .send({ email, password })
            .expect(resp => shouldBeUser(resp.body))
            .expect(HttpStatus.OK, done);
    });

    after(() => Users.remove(user.id));
});
