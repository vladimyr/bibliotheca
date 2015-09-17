var email = require("emailjs");
var logger=require("../logger");

module.exports = email.server.connect({
    host: "mail.vip.hr"
});

module.exports.sendVerificationMail = function (to, link) {
    server.send({
        from: "noreply@extensionengine.com",
        to: to,
        subject: "Verification for ExtensionEngine Books",
        text: "Please verify your account by clicking this link: " + link
    }, function (err, message) {
        logger.info(err || message);
    });
};

