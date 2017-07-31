/**
 * Created by jerry on 2017/7/28.
 */
const http = require('http'),
  URL = require('url'),
  fs = require('fs');

String.prototype.queryURLParams = function () {
  let obj = {},
    reg = /([^?=&#]+)=([^?=&#]+)/g;
  this.replace(reg, function () {
    // arguments[0] === this
    const key = arguments[1];
    obj[key] = arguments[2];
  });
  return obj;
};

const serv = http.createServer((req, res) => {
  const urlObj = URL.parse(req.url),
    pathname = urlObj.pathname,
    jsonPath = './json/customer.json';
  let con = null,
    query = urlObj.query,
    isRoute = false;
  
  if (query) {
    query = query.queryURLParams();
  }
  
  if (pathname === '/getAll') {
    isRoute = true;
    con = fs.readFileSync(jsonPath, 'UTF-8');
    con = con.length === 0 ? [] : con;
    res.writeHead(200, {'content-type': 'text/plain;charset=utf-8;'});
    let result = 'error, its not a jsonp.';
    if (query && query['callback']) {
      // 注意，如果要正确返回jsonp数据，必须设置响应头为text/javascript
      res.writeHead(200, {'content-type': 'text/javascript;charset=utf-8;'});
      result = `${query['callback']}(${con})`;
    }
    res.end(result);
    return
  }

  // 只有路由不匹配时才读本地文件
  if (!isRoute) {
    try {
      res.end(fs.readFileSync(pathname.slice(1)))
    } catch (e) {
      console.log(e.message);
      res.end('404')
    }
  }
  
  
});

serv.on('clientError', (err, socket) => {
  socket.end('HTTP/1.1 400 Bad Request\r\n\r\n');
});

serv.listen(8000);

