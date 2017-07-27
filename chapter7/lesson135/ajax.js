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