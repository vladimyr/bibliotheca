"use strict";

require('dotenv').load();
const mongodbUri = require('mongodb-uri');

const mongoUrl = mongodbUri.format({
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    hosts: [{
        host: process.env.DB_HOST || '127.0.0.1',
        port: process.env.DB_PORT || 27017
    }],
});

module.exports = {
    mongoUrl,
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
