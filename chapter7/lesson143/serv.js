/**
 * Created by jerry on 2017/7/28.
 */
const http = require('http'),
  URL = require('url'),
  fs = require('fs');

const serv = http.createServer((req, res) => {
  const urlObj = URL.parse(req.url),
    pathname = urlObj.pathname,
    jsonPath = './json/customer.json';
  let con = null,
    query = urlObj.query,
    result = null,
    customerID = null,
    isRoute = false,
    tmp = null;

  // 将读取文件转换成数组对象放公共区域
  con = fs.readFileSync(jsonPath, 'UTF-8');
  con = con.length === 0 ? [] : JSON.parse(con);
  query = query === null ? '' : query;
  // 转换查询参数
  if (query.length > 0) {
    tmp = query.split('&');
    query = {};
    for (let i=0;i<tmp.length;i++) {
      query[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
    }
  }

  // 如果路由匹配 /getList
  if (pathname === '/getList') {
    isRoute = true;
    con = JSON.stringify(con);
    result = {
      code: 1,
      msg: '没有任何客户信息',
      data: null
    };
    if (con.length > 0) {
      result = {
        code: 0,
        msg: 'ok',
        data: con
      }
    }
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
  }

  // 如果路由匹配 /getInfo
  if (pathname === '/getInfo') {
    isRoute = true;
  }


  // 只有路由不匹配时才读本地文件
  if (!isRoute) {
    try {
      res.end(fs.readFileSync(req.url.slice(1)))
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

