const http = require('http');
const fs = require('fs');
const url = require('url');

const serv = http.createServer(function (req, res) {
  const urlObj = url.parse(req.url);
  const pathname = urlObj.pathname;
  query = urlObj['query'];
});

serv.listen(8001, function () {
  console.log('server is success, listening on 8001 port!');
});