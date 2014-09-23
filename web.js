// web.js
process.env.PWD = process.cwd();

var express = require("express");
var logfmt = require("logfmt");
var app = express();
var request = require('request');

app.use(express.static(process.env.PWD + '/public'));
app.use(logfmt.requestLogger());

app.get('/dropbox/:slug', function(req, res) {
    var url = 'https://dl.dropboxusercontent.com/u/133963/Blog/' + req.params.slug + '.md';
    request(url, function (err, resp, body) {
        res.send(body);
    });
});

var port = Number(process.env.PORT || 8080);
app.listen(port, function() {
    console.log("Listening on " + port);
});