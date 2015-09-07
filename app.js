"use strict";
var config = require("./config"),
    express = require("express"),
    path = require("path"),
    app = express(),
    cors = require("cors");
app.use(express.static(path.join(__dirname, "/public")));
app.use(cors());

var logger = require("./logger");
var morgan = require("morgan");
app.use(morgan("combined", {"stream": logger.stream}));

var helmet = require("helmet");
app.use(helmet());
logger.info("Helmet initialized");

var bodyParser = require("body-parser");
app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());

var router = express.Router();
app.use(router);

var auth = require("./auth");
auth.init(app);

var common = require("./common");
common.initExtensions();

var controllers = require("./controllers");
controllers.init(router);

app.get("*", function (req, res) {
    res.sendFile(path.join(__dirname, "/public/index.html"));
});

var port = config.port;
app.listen(port);
logger.info("Application listening on port: " + port);
