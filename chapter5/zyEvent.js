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
  var ary = curEle['zyBind' + type];
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
  // var tmpFn = function (e) {
  //   fn.call(curEle, e);
  // };
    var tmpFn = fn.myBind(curEle);
  // 将这个包装对象的原始对象也存入自定义属性，为了辨认！
  // 我靠，我才发现这里是给函数这个对象添加自定义属性，对于JS这门语言我也是醉了~
  tmpFn.proto = fn;
  // 将包装对象存入元素事件池数组
  ary.push(tmpFn);
  curEle.attachEvent("on" + type, tmpFn);
}

function unbind(curEle, type, fn) {
  if ("removeEventListener" in window) {
    curEle.removeEventListener(type, fn);
    return;
  }
  // 以下为IE6~8
  var ary = curEle['zyBind' + type];
  if (ary) {
      for (var i = 0; i < ary.length; i++) {
          if (ary[i].proto === fn) {
              // 删除IE绑定
              curEle.detach("on" + type, curEle.proto);
              // 删除当前元素事件池数组上的该方法
              ary.splice(i, 1);
              return; // 删除完成直接退出整个函数
          }
      }
  }
}

function on (curEle, type, fn) {
  // zyBind 和 zyEvent是两个数组~
  // 这里如果事件池不存在undefined，ary就是undefined，
  // 意思就是ary没拿到内存地址，赋值个空数组给undefined也没意思
  //curEle['zyEvent' + type] ? null : curEle['zyEvent' + type] = [];
  if (!curEle['zyEvent' + type]) curEle['zyEvent' + type] = [];
  var ary = curEle['zyEvent' + type];
  for (var i=0, len=ary.length; i<len; i++) {
    if (ary[i] === fn) {
      // 如果事件池数组中已经绑定该方法就直接返回
      return;
    }
  }
  // 检查通过后将方法存在事件池数组中
  ary.push(fn);
  // 注意：因为bind方法里我们处理了重复问题，所以可以重复绑定run方法，没事
  bind(curEle, 'click', run);
}

function off (curEle, type, fn) {
  // off就简单了，只需要操作一下事件池数组就行了
  var ary = curEle['zyEvent' + type];
  if (ary) {
    for (var i=0; i< ary.length; i++) {
      if(ary[i] === fn) {
        ary.splice(i, 1);
        // ary[i] = null;
        return;
      }
    }
  }
}

// run方法将会绑定到元素有触发的所有行为上，
//   通过run方法获取该元素自定义属性对应的行为事件池池的数组，然后逐一执行。
function run(e) {
  // 在bind方法里，会将行为触发全部绑定到run上，run如要做的就是拿到元素和事件类型
  e = e || window.event;
  e.target = e.target || e.srcElement;
  var type = e.type,
      ary = this['zyEvent' + type];
  //ary = e.target['zyEvent' + type];
  if (ary) {
      // for (var i = 0; i < ary.length; i++) { 不能这样设置len了，因为要删除数组，用这方式会数组塌陷！
      for (var i = 0, len = ary.length; i < len; i++) {
          if(typeof(ary[i]) === "function") {
              ary[i].call(this, e); // 传入当前元素this和Event对象
          } else {
              // 如果不是函数直接删除当前项
              ary.splice(i, 1);
              i--;
          }
      }
  }
}