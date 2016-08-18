// (echo -en "GET /1 HTTP/1.1\n\nGET /2 HTTP/1.1\n\n"; sleep 10) | nc localhost 3000
var express = require('express');
var app = express();

app.get('/1', function (req, res) {
  res.send('1');
});

app.get('/2', function (req, res) {
  res.send("2")
});
 

var server = app.listen(3000, function () {
  var host = server.address().address;
  var port = server.address().port;
  console.log('listening at http://%s:%s', host, port);
});