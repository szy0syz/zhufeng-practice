// ~function () {

//myBind
Function.prototype.myBind = function myBind(context) {
  // 实现bind，原理是匿名函数外包一层，每次执行myBind就产生一个新作用域
  // 用的时候这样用hi.myBind(obj)，这个时候返回的是一个堆内存和与之链接的作用域
  // 这个时候我们要先将this保存起来，这个this就是hi方法的堆内存地址~
  var _this = this;
  // 接收一下用myBind时传入的外层参数，注意，这里arguments是类数组
  // 这里从索引1开始转数组，索引0是context不需要。
  var outerArg = Array.prototype.slice.call(arguments, 1);
  // 可以准备返回堆内存了，就是返回匿名函数~
  return function () {
    // 进来首先也是准备接收它的参数，这里得从索引0开始转换数组了
    var innerArg = [].__proto__.slice.call(arguments, 0);
    // 准备要执行了，我们先去上级作用域拿到要修改this的方法hi的堆内存，在_this中保存
    // 替换hi方法的this用上级作用域传入形参context~
    // 链接两个参数数组时，注意顺序，outer后面跟inner
    _this.apply(context, outerArg.concat(innerArg));
  }; // 打完收工
};
/////////////↓↓↓↓↓以下是myBind测试↓↓↓↓↓///////////////
//   function hi(one, two) {
//     console.log(this.hello + ', ' + one + ' ' + two + '.')
//   }
//
//   var o = {hello: 'hello'};
//   hi.myBind(o, 'jerry')('shi'); //直接执行
//   var fn1 = hi.myBind(o, 'jerry'); //赋值堆地址等待执行
//   fn1('shi');
/////////////↑↑↑↑↑以上是myBind测试↑↑↑↑↑///////////////

function bind(curEle, type, fn) {
  // 兼容性判断，如果兼容就用标准浏览器的方法
  if ("addEventListener" in window) {
    curEle.addEventListener(type, fn);
    return;
  }
  // 以下为IE6~8
  // 取出当前元素事件池数组
  // 判断事件池是否存在，不存在赋值空数组
  var ary = curEle['myEvent' + type];
  ary = ary ? null : [];
  // for循环检测该方法是否已经存在事件池中
  for (var i = 0, len = ary.length; i < len; i++) {
    // 取包装前的原始对象对比
    if (ary[i].proto === fn) {
      // 如果存在则直接return整个函数(先退for循环后再退整个函数)，不能重复绑定
      return;
    }
  }
  // 过了上面的检查，再创建一个包装对象
  var tmpFn = function (e) {
    fn.call(curEle, e);
  };
  // 将这个包装对象的原始对象也存入自定义属性，为了辨认！
  tmpFn.proto = fn;
  curEle.attachEvent("on" + type, tmpFn);
  ///////////////////////////////////////
  //到目前为止，解决了this问题和重复问题，还差顺序问题
}

function unbind(curEle, type, fn) {
  if ("removeEventListener" in window) {
    curEle.removeEventListener(type, fn);
    return;
  }
  // 以下为IE6~8
  var ary = curEle['myEvent' + type];
  for (var i = 0, len = ary.length; i < len; i++) {
    if (ary[i].proto === fn) {
      // 删除绑定
      curEle.detach("on" + type, curEle.proto)
    }
  }
}

// run方法将会绑定到元素有触发的所有行为上，
//   通过run方法获取该元素自定义属性对应的行为事件池池的数组，然后逐一执行。
function run(e) {
  
}

// }();