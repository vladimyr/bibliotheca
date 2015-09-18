var email = require("emailjs");
var logger = require("../logger");
var config = require("../config");

var server = email.server.connect({
    host: "mail.vip.hr"
});

//TODO: change 'to' in production
server.sendVerificationMail = function (to, token) {
    var url = config.apiUrl + "/register/" + token;
    server.send({
        from: "noreply@extensionengine.com",
        //to: to,
        to: "dbettini@extensionengine.com",
        subject: "Verification for ExtensionEngine Books",
        text: "Please verify your account by clicking on this link: " + url
    }, function (err, message) {
        logger.info(err || message);
    });
};

module.exports = server;