~function () {
  
  function bind (curEle, type, fn) {
      // 兼容性判断，如果兼容就用标准浏览器的方法
      if ("addEventListener" in window) {
          curEle.addEventListener(type, fn);
          return;
      }
      // 以下为IE6~8
      curEle.attachEvent("on" + type, function (e) {
        // this -> window
        fn.call(curEle,e);
      });
  }

  function unbind (curEle, type, fn) {
      if ("removeEventListener" in window) {
           curEle.removeEventListener(type, fn);
           return;
      }
      // 问题来了，删不掉！
  }


}();