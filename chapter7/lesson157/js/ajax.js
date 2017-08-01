(function () {
  function createXHR() {
    var xhr = null,
      ary = [
        function () {
          return new XMLHttpRequest;
        },
        function () {
          return new ActiveXObject("Microsoft.XMLHTTP");
        },
        function () {
          return new ActiveXObject("Msxml2.XMLHTTP");
        },
        function () {
          return new ActiveXObject("Msxml3.XMLHTTP");
        }
      ];
    var i, len;
    for (i = 0, len = ary.length; i < len; i++) {
      try {
        xhr = ary[i](); // 直接返回执行结果
        // 如果能运行到下面说明刚好能兼容
        // 既然能兼容就直接修改这个函数堆内存指向数组中兼容的函数
        createXHR = ary[i];
        break; //不能再循环了
      } catch (e) {
        console.log('Your bowser is not support ajax.');
      }
    }
    return xhr;
  }
  
  function ajax(options) {
    // 配置默认项
    var _default = {
      type: 'get',
      url: '',
      async: true,
      dataType: 'JSON',
      data: null,
      header: null,
      success: null
    };
    
    // options 覆盖 _default (以后都用_default)
    for (var key in _default) {
      // 只要非继承属性 && 只覆盖默认对象里有的属性
      if (_default.hasOwnProperty(key) && options[key]) {
        _default[key] = options[key];
      }
    }
    
    // 处理添加随机数杜绝缓存
    _default.url += _default.url.indexOf('?') >= 0 ? '&' : '?';
    _default.url += '_=' + Math.random();
    
    // 开始配置ajax对象
    var xhr = createXHR();
    xhr.open(_default.type, _default.url, _default.async);
    xhr.onreadystatechange = function () {
      if (/^2\d\d/.test(xhr.status)) {
        if (xhr.readyState === 2) {
          typeof _default.header === 'function' ? _default.header.call(xhr) : null;
        }
        if (xhr.readyState === 4) {
          var res = xhr.responseText;
          if (_default.dataType.toLocaleUpperCase() === 'JSON') {
            try { // 处理给JSON转一个普通字符串时的异常
              res = 'JSON' in window ? JSON.parse(res) : eval('(' + res +')');
            } catch (e) {
              console.error(e)
            }
          }
          typeof _default.success === 'function' ? _default.success.call(xhr, res) : null;
        }
      }
    };
    xhr.send(_default.data);
  }
  
  window.ajax = ajax;
})();