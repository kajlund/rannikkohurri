// web.js
process.env.PWD = process.cwd();

var express = require("express");
var logfmt = require("logfmt");
var app = express();
var request = require('request');

app.use(express.static(process.env.PWD + '/public'));
app.use(logfmt.requestLogger());

var port = Number(process.env.PORT || 8080);
app.listen(port, function() {
    console.log("Listening on " + port);
});