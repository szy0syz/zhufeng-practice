/**
 * Created by jerry on 2017/7/4.
 */

// 实现JavaScript原生bind方法
Function.prototype.myBind = function myBind(context) {
  // 实现原理，包一层不销毁的私有作用域，保存this(此时为那个要修改的函数)，传入的context变量就是新的函数内this，再保存外层myBind函数参数(舍去第一个)
  var _this = this; // 这里this为那个要修改的函数
  var outerArg = [].slice.call(arguments, 1);//myBind在绑定时第二个起的参数
  return function () { // 再套一层作用域
    var innerArg = [].slice.call(arguments, 0);  // 获取修改完this的函数执行时的所有参数
    _this.apply(context, outerArg.concat(innerArg)); // 修改this，将外层+内层参数链接，存个堆内存等待执行~
  }
};
/////////////↓↓↓↓↓以下是myBind测试↓↓↓↓↓///////////////
// function hi (one,two) {
//   console.log(this.hello + ', ' + one + ' ' + two + '.')
// }
// var o = { hello: 'hello' };
// hi.myBind(o,'jerry')('shi'); //直接执行
// var fn1 = hi.myBind(o,'jerry'); //赋值堆地址等待执行
// fn1('shi');
/////////////↑↑↑↑↑以上是myBind测试↑↑↑↑↑///////////////
////////////实现原理总结
//1. 在Funtion类的原型上添加一个新方法；
//2. 方法接收一个context参数，代表新的this
//3. 进方法后首先保存this到_this，这里this就是需要修改this的那个方法
//4. 保存myBind方法的第二个起的所有参数
//5. 创建一个匿名方法用于返回，这个新的匿名方法其实就是堆内存
//6. 在匿名方法中线保存所有形参
//7. 最后使用apply修改上层作用域_this(原方法)中的this，然后将外层和内层两层参数连接后传递，然后返回这个堆内存


/**使用兼容方式为元素绑定行为事件
 * @curEle: 当前元素
 * @type: 行为类型
 * @fn: 回调函数
 * */
function bind(curEle, type, fn) {
  if ("addEventListener" in document) {
    curEle.addEventListener(type, fn, false);
    return;
  }
  !curEle["myBind" + type] ? curEle["myBind" + type] = [] : null;
  var ary = curEle["myBind" + type];
  for (var i = 0, len = ary.length; i < len; i++) {
    if (ary[i].photo === fn) {
      return;
    }
  }
  var tempFn = fn.myBind(curEle);
  tempFn.photo = fn;
  ary.push(tempFn);
  curEle.attachEvent("on" + type, tempFn);
}

function unbind(curEle, type, fn) {
  if ("removeEventListener" in document) {
    curEle.removeEventListener(type, fn, false);
    return;
  }
  var ary = curEle["myBind" + type];
  if (ary) {
    for (var i = 0, len = ary.length; i < len; i++) {
      var curFn = ary[i];
      if (curFn.photo === fn) {
        curEle.detachEvent("on" + type, curFn);
        ary.splice(i, 1);
        return;
      }
    }
  }
}

//创建事件池，并且把需要给当前元素绑定的方法依次的增加到事件池中
function on(curEle, type, fn) {
  //判断当前元素的某行为事件池是否存在，不存在就赋空数组
  !curEle["myEvent" + type] ? curEle["myEvent" + type] = [] : null;
  var ary = curEle["myEvent" + type];
  for (var i = 0, len = ary.length; i < len; i++) {
    var cur = ary[i];
    if (cur === fn) return;
  }
  ary.push(fn);
  //curEle.addEventListener(type, run, false);//执行on的时候随带给当前元素绑定一个点击行为，点击时执行run方法，run方法中this是当前元素curEle，并且浏览器给run传递了一个MouseEvent事件对象
  bind(curEle, type, run); //使用已经实现兼容且处理过重复和this问题的绑定方法
}
//在自己的事件池中吧某一个方法移除
function off(curEle, type, fn) {
  var ary = curEle["myEvent" + type];
  for (var i=0, len=ary.length; i< len; i++) {
    if (ary[i] === fn) {
      ary.splice(i,1);
      break;// 完全不需要执行行为，仅仅是删除事件池中的事件而已。
    }
  }
}

// 只给当前元素的点击行为绑定一个方法润，当触发某行为时执行的也就是run方法，我们在run方法中根据自己存储的方法新顺序分别执行所这些方法即可
function run(e) {
  e = e || window.event;
  var flag = !!e.target; // 判断当前浏览器是否是IE6~8，false为IE6~8
  if (!flag) {
    // 处理IE兼容问题
    e.target = e.target || e.srcElement;
    e.pageX = e.clientX + (document.documentElement.scrollLeft || document.body.scrollLeft);
    e.pageY = e.clientY + (document.documentElement.scrollTop || document.body.scrollTop);
    e.preventDefault = function () {
      e.returnValue = false;
    };
    e.stopPropagation = function () {
      e.cancelBubble = true;
    }
  }

  // 获取自己事件池中绑定的那些方法，并且让这些方法依次执行
  var ary = this["myEvent" + e.type];
  for (var i = 0, len = ary.length; i < len; i++) {
    ary[i].call(this, e); // 执行时记得修改this和传递mouseEvent对象~
  }
}