var http = require('http'),
  { URL } = require('url'),
  fs = require('fs');

var serv = http.createServer((req, res) => {
  // var { URL } = require('url');
  // var myURL = new URL('https://user:pass@sub.host.com:8080/p/a/t/h?query=string#hash');
  // console.log(myURL.pathname)

  console.log(req.url);
  // if (req.url === '/index.html') {
  //   var con = fs.readFileSync('index.html');
  //   return res.end(con)
  // }
  try {
    res.end(fs.readFileSync(req.url.slice(1)))
  } catch(e) {
    console.log(e.message);
    res.end('over')
  }
  
});

serv.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

serv.listen(8000);

