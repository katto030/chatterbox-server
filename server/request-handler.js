var storage = [];
var msgID = 0;

var requestHandler = function(request, response) {

  console.log('Serving request type ' + request.method + ' for url ' + request.url);
  var statusCode = 200;

  var headers = defaultCorsHeaders;

  request.on('error', (err) => {
    console.error(err);
  });

  headers['Content-Type'] = 'application/json';

  if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(headers));
  } else if (!request.url.includes('/classes/messages')) {
    statusCode = 404;
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(headers));
  } else if (request.method === 'GET') {
    response.writeHead(statusCode, headers);
    response.end(JSON.stringify(storage));
  } else if (request.method === 'POST') {
    statusCode = 201;
    response.writeHead(statusCode, headers);
    request.on('data', (chunk) => {
      let modified = {};
      modified['message_id'] = msgID;
      modified.username = JSON.parse(chunk.toString()).username;
      modified.text = JSON.parse(chunk.toString()).text;
      modified.roomname = JSON.parse(chunk.toString()).roomname;
      modified['createAt'] = Date();
      msgID ++;
      storage.unshift(modified);
    }).on('end', () => {
      response.end(JSON.stringify(storage));
    });
  } else if (request.method === 'OPTIONS') {
    response.writeHead(statusCode, headers);
    response.end();
  }
};

var defaultCorsHeaders = {
  'access-control-allow-origin': '*',
  'access-control-allow-methods': 'GET, POST, PUT, DELETE, OPTIONS',
  'access-control-allow-headers': 'content-type, accept, authorization',
  'access-control-max-age': 10 // Seconds.
};

module.exports.requestHandler = requestHandler;