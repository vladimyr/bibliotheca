var email = require("emailjs"),
    logger = require("../logger"),
    config = require("../config");

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

server.sendUnverifiedBooksMail = function (to) {
    var url = config.webUrl;
    server.send({
        from: "noreply@extensionengine.com",
        //to: to,
        to: "dbettini@extensionengine.com",
        subject: "Notification for EE Books admin",
        text: "With great power comes great responsibility! " +
        "There are new books waiting for you to verify them at " + url
    }, function (err, message) {
        logger.info(err || message);
    });
};

module.exports = server;