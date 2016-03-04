"use strict";

module.exports = {
    mongoUrl: "mongodb://localhost:27017/books",
    //port : process.env.port || 1337
    port: 1337,
    //used globally
    webUrl: "http://localhost:1337",
    //used locally
    apiUrl: "http://localhost:1337/api",
    secret: "randomBookSecret",
    tokenMs: 604800000,
    verifyTokenMs: 86400000,
    email: {
        user: "books@extensionengine.com",
        password: "yYEggyT2R!"
    },
    //TODO: check this array for allowed domains
    domains: [
        "@extensionengine.com"//generate regexp from this
    ]
};