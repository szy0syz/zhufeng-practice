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
    tmp = null,
    updated = false,
    cb = null;

  // 将读取文件转换成数组对象放公共区域
  con = fs.readFileSync(jsonPath, 'UTF-8');
  con = con.length === 0 ? [] : JSON.parse(con);
  query = query === null ? '' : query;
  // 转换查询参数
  if (query.length > 0) {
    tmp = query.split('&');
    query = {};
    for (let i = 0; i < tmp.length; i++) {
      query[tmp[i].split('=')[0]] = tmp[i].split('=')[1];
    }
    if (query.id) {
      customerID = query.id.toString();
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
      };
    }
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
  }

  // 如果路由匹配 /getInfo
  if (pathname === '/getInfo') {
    isRoute = true;
    result = {
      code: 1,
      msg: '没有此客户信息',
      data: null
    };
    for (let i = 0; i < con.length; i++) {
      if (con[i].id.toString() === customerID) {
        result = {
          code: 0,
          msg: 'ok',
          data: con[i]
        };
      }
    }
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
  }

  if (pathname === '/del') {
    isRoute = true;
    // 循环数据
    for (let i = 0; i < con.length; i++) {
      if (con[i].id.toString() === customerID) {
        // 把指定客户从数组中删除，等会要写入
        con.splice(i, 1);
        updated = true;
        break;
      }
    }
    if (updated) {
      // 如果有更新，就把con数组转换成JSON字符串后再写入文件
      fs.writeFileSync(jsonPath, JSON.stringify(con));
    }
    result = {
      code: 0,
      msg: '删除成功'
    };
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
  }

  // 关于更新数据库就放在外面统一更新


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

