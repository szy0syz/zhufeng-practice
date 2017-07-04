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