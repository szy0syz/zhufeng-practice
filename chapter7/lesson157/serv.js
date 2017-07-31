const http = require('http');
const fs = require('fs');
const url = require('url');

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

const serv = http.createServer(function (req, res) {
  const urlObj = url.parse(req.url);
  const pathname = urlObj.pathname;
  query = urlObj['query'];
  let i = 0,
    result = null;
  // -> 处理静态资源的请求
  const reg = /.(HTML|JS|CSS|ICO)/i; // 小正则捕获后缀名，不区分大小写。
  if (reg.test(pathname)) {
    const suffix = reg.exec(pathname)[1].toUpperCase();
    const suffixMIME = suffix === 'HTML' ? 'text/html' : (suffix === 'CSS' ? 'text/css' : (suffix === 'JS' ? 'text/javascript' : (suffix === 'ICO' ? 'image/x-icon' : 'text/plain')));
    try {
      res.writeHead(200, {'content-type': `${suffixMIME};charset=utf-8;`});
      res.end(fs.readFileSync('.' + pathname, 'utf-8'));
    } catch (e) {
      res.writeHead(404);
      res.end('file is not found.');
    }
    return
  }

  query = query.queryURLParams();

  // 处理API接口文档规定的数据请求
  let data = JSON.parse(fs.readFileSync('./json/students.json', 'utf-8'));
  if (pathname === '/getList') {
    const n = query['n'];
    let ary = [];
    for (i = (n - 1) * 3; i <= n * 3 - 1; i++) {
      // 如果已经到了数组最后一个，直接跳出了，因为之前每次都push，不怕得。
      if (i > data.length - 1) {
        break;
      }
      ary.push(data[i]);
    }
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify({
      code: 0,
      msg: 'ok',
      total: Math.ceil(data.length / 3),
      data: ary
    }));

    return
  }

  if (pathname === '/getInfo') {
    const sid = query['id'];
    let obj = null;
    for (i = 0; i < data.length; i++) {
      if (data[i].id.toString() === sid) { // 劳资死也不用'=='，因为JS语言精粹的作者大叔和我说的！
        obj = data[i];
      }
    }
    result = { code: 1, msg: '内容不存在', data: null};
    if (obj) {
      result = {
        code: 0,
        msg: 'ok',
        data: obj
      }
    }
    res.writeHead(200, {'content-type': 'application/json;charset=utf-8;'});
    res.end(JSON.stringify(result));
    return
  }

  // 啥也没找到就404
  res.end('404');
});

serv.listen(8001, function () {
  console.log('server is success, listening on 8001 port!');
});