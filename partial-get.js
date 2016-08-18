/*
$nc localhost 8000
GET /hello.txt HTTP/1.1
Range: bytes=0-2
*/
var PORT =8000
var http = require("http");
var fs = require("fs");
var path = require("path");
var url = require('url');

var mimeNames = {
    '.txt': 'text/plain'
};

http.createServer(httpListener).listen(PORT);

function httpListener(request, response) {
    // 仅仅接受GET方法.
    if (request.method != 'GET') {
        sendResponse(response, 405, { 'Allow': 'GET' }, null);
        return null;
    }

    var filename =
        "./" + url.parse(request.url, true, true).pathname.split('/').join(path.sep);

    if (!fs.existsSync(filename)) {
        sendResponse(response, 404, null, null);
        return null;
    }

    var responseHeaders = {};
    var stat = fs.statSync(filename);
    var rangeRequest = readRangeHeader(request.headers['range'], stat.size);


    if (rangeRequest == null) {
        responseHeaders['Content-Type'] = getMimeNameFromExt(path.extname(filename));
        responseHeaders['Content-Length'] = stat.size;  // File size.
        responseHeaders['Accept-Ranges'] = 'bytes';
        sendResponse(response, 200, responseHeaders, fs.createReadStream(filename));
        return null;
    }

    var start = rangeRequest.Start;
    var end = rangeRequest.End;

    // If the range can't be fulfilled. 
    if (start >= stat.size || end >= stat.size) {
        // Indicate the acceptable range.
        responseHeaders['Content-Range'] = 'bytes */' + stat.size; // File size.

        // Return the 416 'Requested Range Not Satisfiable'.
        sendResponse(response, 416, responseHeaders, null);
        return null;
    }

    // Indicate the current range. 
    responseHeaders['Content-Range'] = 'bytes ' + start + '-' + end + '/' + stat.size;
    responseHeaders['Content-Length'] = start == end ? 0 : (end - start + 1);
    responseHeaders['Content-Type'] = getMimeNameFromExt(path.extname(filename));
    responseHeaders['Accept-Ranges'] = 'bytes';
    responseHeaders['Cache-Control'] = 'no-cache';

    // Return the 206 'Partial Content'.
    sendResponse(response, 206, responseHeaders, fs.createReadStream(filename, { start: start, end: end }));
}

function sendResponse(response, responseStatus, responseHeaders, readable) {
    response.writeHead(responseStatus, responseHeaders);

    if (readable == null)
        response.end();
    else
        readable.on('open', function () {
            readable.pipe(response);
        });

    return null;
}

function getMimeNameFromExt(ext) {
    var result = mimeNames[ext.toLowerCase()];
    if (result == null)
        result = 'application/octet-stream';
    
    return result;
}

function readRangeHeader(range, totalLength) {
    if (range == null || range.length == 0)
        return null;

    var array = range.split(/bytes=([0-9]*)-([0-9]*)/);
    var start = parseInt(array[1]);
    var end = parseInt(array[2]);
    var result = {
        Start: isNaN(start) ? 0 : start,
        End: isNaN(end) ? (totalLength - 1) : end
    };
    
    if (!isNaN(start) && isNaN(end)) {
        result.Start = start;
        result.End = totalLength - 1;
    }

    if (isNaN(start) && !isNaN(end)) {
        result.Start = totalLength - end;
        result.End = totalLength - 1;
    }

    return result;
}

