"use strict";
module.exports = {
    mongoUrl: "mongodb://localhost:27017/books",
    //port : process.env.port || 1337
    port: 1337,
    apiUrl: "http://localhost:1337/api",
    secret: "randomBookSecret",
    tokenMs: 60000000000
};