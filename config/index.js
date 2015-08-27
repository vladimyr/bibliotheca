"use strict"
module.exports = {
    mongoUrl: "mongodb://localhost:27017/books",
    //port : process.env.port || 1337
    port: 1337,
    secret: "randomBookSecret",
    tokenMs: 60000000000
};