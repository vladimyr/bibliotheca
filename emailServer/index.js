var email = require("emailjs"),
    logger = require("../logger"),
    config = require("../config");

var server = email.server.connect({
    host: "ms1.extensionengine.com",
    user: config.email.user,
    password: config.email.password,
    tls: true
});

//TODO: PRODUCTION: change 'to'
server.sendVerificationMail = function (to, token) {
    var url = config.webUrl + "/api/register/" + token;
    server.send({
        from: "noreply@extensionengine.com",
        to: to,
        // to: "dbettini@extensionengine.com",
        subject: "Verification for ExtensionEngine Books",
        text: "Please verify your account by clicking on this link: " + url
    }, function (err, message) {
        if (err)
            logger.error(err);
        else
            logger.info(message);
    });
};

//TODO: PRODUCTION: change 'to'
server.sendUnverifiedBooksMail = function (to) {
    var url = config.webUrl;
    server.send({
        from: "noreply@extensionengine.com",
        to: to,
        // to: "dbettini@extensionengine.com",
        subject: "Notification for EE Books admin",
        text: "With great power comes great responsibility! " +
        "There are new books waiting for you to verify them at " + url
    }, function (err, message) {
        if (err)
            logger.error(err);
        else
            logger.info(message);
    });
};

//TODO: PRODUCTION: change 'to'
server.sendNewPassMail = function (to, newPass) {
    server.send({
        from: "noreply@extensionengine.com",
        to: to,
        // to: "dbettini@extensionengine.com",
        subject: "New password for EE Books",
        text: "This is your new password: " + newPass
    }, function (err, message) {
        if (err)
            logger.error(err);
    });
}

module.exports = server;
