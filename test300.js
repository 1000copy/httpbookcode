var express = require('express');
var app = express();

app.get('/', function (req, res) {
  res.send('<a href="/test204">204</a> <a href="/test205">205</a>');
});

app.get('/test300', function (req, res) {
  res.status(300).send("Hello World!")
});
 

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;

  console.log('Example app listening at http://%s:%s', host, port);
});