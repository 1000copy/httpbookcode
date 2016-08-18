var express = require('express');
var app = express();
app.get('/hello.htm', function (req, res) {
  res.send('<h1>Hello, World!</h1>');
});
var server = app.listen(3000, function () {
  console.log('listening on 3000');
});