

var http = require('http')
  , util = require('util')
  , crypto = require('crypto')
  , events = require('events')
  , net = require("net")

var handlers =  {
  valid: validServer,
  invalidKey: invalidRequestHandler,
  closeAfterConnect: closeAfterConnectHandler,
  return401: return401
}
function createServer(cb) {
  var webServer = http.createServer(function (req, res) {
    res.writeHead(200, {'Content-Type': 'text/plain'});
    res.end('okay');
  });
  var srv = new Server(webServer); 
  webServer.on('upgrade', function(req, socket) {
    console.log("upgrade")
    webServer._socket = socket; 
    validServer(srv, req, socket); 
  });
  webServer.listen(8181, '127.0.0.1', function() { if (cb) cb(srv); });
}


/**
 * Test strategies
 */

function validServer(server, req, socket) {
  if (typeof req.headers.upgrade === 'undefined' ||
    req.headers.upgrade.toLowerCase() !== 'websocket') {
    throw new Error('invalid headers');
    return;
  }

  if (!req.headers['sec-websocket-key']) {
    socket.end();
    throw new Error('websocket key is missing');
  }

  // calc key
  var key = req.headers['sec-websocket-key'];
  var shasum = crypto.createHash('sha1');
  shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
  key = shasum.digest('base64');

  var headers = [
      'HTTP/1.1 101 Switching Protocols'
    , 'Upgrade: websocket'
    , 'Connection: Upgrade'
    , 'Sec-WebSocket-Accept: ' + key
  ];

  socket.write(headers.concat('', '').join('\r\n'));
  socket.setTimeout(0);
  socket.setNoDelay(true);
   console.log("valid,and Switching")
  socket.on('data', function (data) {
    // WebSocket的协议解码
    // WebSocket 编码
   // socket.write(data);
   // socket.write( new Buffer("810548656c6f","hex"))//0x81 0x05 0x48 0x65 0x6c 0x6c 0x6f)
  console.log("Received server:"+data)
   socket.write((parseInt(data)+1).toString())
  });
  socket.on('end', function() {
    socket.end();
  });
}

function invalidRequestHandler(server, req, socket) {
  if (typeof req.headers.upgrade === 'undefined' ||
    req.headers.upgrade.toLowerCase() !== 'websocket') {
    throw new Error('invalid headers');
    return;
  }

  if (!req.headers['sec-websocket-key']) {
    socket.end();
    throw new Error('websocket key is missing');
  }

  // calc key
  var key = req.headers['sec-websocket-key'];
  var shasum = crypto.createHash('sha1');
  shasum.update(key + "bogus");
  key = shasum.digest('base64');

  var headers = [
      'HTTP/1.1 101 Switching Protocols'
    , 'Upgrade: websocket'
    , 'Connection: Upgrade'
    , 'Sec-WebSocket-Accept: ' + key
  ];

  socket.write(headers.concat('', '').join('\r\n'));
  socket.end();
}

function closeAfterConnectHandler(server, req, socket) {
  if (typeof req.headers.upgrade === 'undefined' ||
    req.headers.upgrade.toLowerCase() !== 'websocket') {
    throw new Error('invalid headers');
    return;
  }

  if (!req.headers['sec-websocket-key']) {
    socket.end();
    throw new Error('websocket key is missing');
  }

  // calc key
  var key = req.headers['sec-websocket-key'];
  var shasum = crypto.createHash('sha1');
  shasum.update(key + "258EAFA5-E914-47DA-95CA-C5AB0DC85B11");
  key = shasum.digest('base64');

  var headers = [
      'HTTP/1.1 101 Switching Protocols'
    , 'Upgrade: websocket'
    , 'Connection: Upgrade'
    , 'Sec-WebSocket-Accept: ' + key
  ];

  socket.write(headers.concat('', '').join('\r\n'));
  socket.end();
}


function return401(server, req, socket) {
  var headers = [
      'HTTP/1.1 401 Unauthorized'
    , 'Content-type: text/html'
  ];

  socket.write(headers.concat('', '').join('\r\n'));
  socket.write('Not allowed!');
  socket.end();
}

/**
 * Server object, which will do the actual emitting
 */

function Server(webServer) {
  this.webServer = webServer;
}

util.inherits(Server, events.EventEmitter);

Server.prototype.close = function() {
  this.webServer.close();
  if (this._socket) this._socket.end();
}

createServer(a)
function a(){
  var client = new net.Socket();
  client.connect(8181, '127.0.0.1', function() {
    console.log('Connected');
    var headers = [
      "GET ws://localhost:8181 HTTP/1.1",
      "Origin: http://localhost:8181",
      "Cookie: __utma=99as",
      "Connection: Upgrade",
      "Host: localhost",
      "Sec-WebSocket-Key: uRovscZjNol/umbTt5uKmw==",
      "Upgrade: websocket",
      "Sec-WebSocket-Version: 13"
      ]
    headers = headers.concat('', '').join('\r\n')
    client.write(headers);
  });

  client.on('data', function(data) {
    var str ="HTTP/1.1 101"
   
    // console.log(data.toString("utf8",0,str.length)==str)
    if (data.toString("utf8",0,str.length) == str){
        console.log('Client Switched: ' );
        client.write("1")
    }else
       console.log(data.toString())
    // client.write("1")
    // if (parseInt(data)>50)
    //    client.destroy(); // kill client after server's response
  });

  client.on('close', function() {
    console.log('Connection closed');
  });
}

function b(){
  var client = new net.Socket();
  client.connect(8181, '127.0.0.1', function() {
    client.write("GET /1\r\n\r\n");

  });
  client.on("data",function(data){
      console.log(data.toString())
  })
}

function c(){
  var client = new net.Socket();
  client.connect(8181, '127.0.0.1', function() {
    client.end("1\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n\r\n");

  });
  client.on("data",function(data){
      console.log(data.toString())
  })
}