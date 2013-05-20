var http = require('http');
var server = http.createServer();
var hostname = require("os").hostname();
function handleRequest(req, res) {
  res.writeHead(200, { 'content-type': 'text/plain'});
  res.write(hostname);
  res.end();
}
server.on('request', handleRequest);
server.listen(3391);

//console.log(hostname)
//process.exit()