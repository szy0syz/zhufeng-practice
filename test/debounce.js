var count = 1;
var container = document.getElementById('container');

function getUserAction(e) {
  console.dir(this);
  console.dir(e);
  container.innerHTML = count++;
}

// 直接绑定，没有任何防抖机制
// container.onmousemove = getUserAction;

// 第一波 防抖
// function debounce(func, wait) {
//   var timeout;
//   return function () {
//     clearTimeout(timeout);
//     timeout = setTimeout(func, wait);
//   }
// }

// 防抖第一波
//container.onmousemove = debounce(getUserAction, 500);

// 第二波 防抖
// function debounce(func, wait) {
//   // 这里生产了一个不销毁的私有作用域
//   // 每一次mousemove行为触发都会来这里找func，wait和timeout
//   var timeout;
//   return function () {
//     // 保存调用改函数的this传入func中
//     var _this = this;
//     clearTimeout(timeout);
//     timeout = setTimeout(function () {
//       func.apply(_this);
//     }, wait);
//   }
// }
//
// // 防抖第二波
// container.onmousemove = debounce(getUserAction, 500);

// 第三波 防抖
// function debounce(func, wait) {
//   // 这里生产了一个不销毁的私有作用域
//   // 每一次mousemove行为触发都会来这里找func，wait和timeout
//   var timeout;
//   return function () {
//     // 保存调用改函数的this传入func中
//     var _this = this;
//     var args = arguments;
//     clearTimeout(timeout);
//     timeout = setTimeout(function () {
//       func.apply(_this, args);
//     }, wait);
//   }
// }

// 第四波
// function debounce(func, wait, immediate) {
//   var timeout, result; // result 要定义不销毁的作用域里~
//   return function () {
//     var _this = this;
//     var args = arguments;
//     if (timeout) clearTimeout(timeout);
//     if(immediate) {
//       // 这里的意思是说，如果没执行过func，就执行
//       var callNow = !timeout;
//       timeout = setTimeout(function () {
//         timeout = null; // 也是等到wait时间后再请timeout,到时间后才会执行第二次
//       }, wait);
//       // 如果从来没有执行过func，就立即执行
//       if (callNow) func.apply(_this, args);
//     } else {
//       timeout = setTimeout(function () {
//         // 这里只异步空间，如果这里赋值result的话会一直都是undefined
//         func.apply(_this, args); // apply接收数组参数
//       }, wait);
//     }
//   }
// }

// 第五波
// function debounce(func, wait, immediate) {
//   var timeout, result; // result 要定义不销毁的作用域里~
//   return function () {
//     var _this = this;
//     var args = arguments;
//     if (timeout) clearTimeout(timeout);
//     if(immediate) {
//       // 这里的意思是说，如果没执行过func，就执行
//       var callNow = !timeout;
//       timeout = setTimeout(function () {
//         timeout = null; // 也是等到wait时间后再请timeout,到时间后才会执行第二次
//       }, wait);
//       // 如果从来没有执行过func，就立即执行
//       // 这里不是异步，这里可以返回值
//       if (callNow) result = func.apply(_this, args);
//     } else {
//       timeout = setTimeout(function () {
//         // 这里只异步空间，如果这里赋值result的话会一直都是undefined
//         func.apply(_this, args); // apply接收数组参数
//       }, wait);
//     }
//   }
// }

// 第六波
function debounce(func, wait, immediate) {
  var timeout, result; // result 要定义不销毁的作用域里~
  // 将翻来的匿名函数换成具名函数，是为了给函数添加一个属性，在这个作用域里变量共享，则可以取消防抖。
  var debounced = function () {
    var _this = this;
    var args = arguments;
    if (timeout) clearTimeout(timeout);
    if(immediate) {
      // 这里的意思是说，如果没执行过func，就执行
      var callNow = !timeout;
      timeout = setTimeout(function () {
        timeout = null; // 也是等到wait时间后再请timeout,到时间后才会执行第二次
      }, wait);
      // 如果从来没有执行过func，就立即执行
      // 这里不是异步，这里可以返回值
      if (callNow) result = func.apply(_this, args);
    } else {
      timeout = setTimeout(function () {
        // 这里只异步空间，如果这里赋值result的话会一直都是undefined
        func.apply(_this, args); // apply接收数组参数
      }, wait);
    }
  };
  
  // 这个取消防抖的意思也就是恢复防抖机制进如初始状态
  debounced.cancel = function () {
    clearTimeout(timeout);
    timeout = null; // 恢复初始化状态
  };
  return debounced;
}

container.onmousemove = debounce(getUserAction, 1000, true);

document.getElementById("button").addEventListener('click', function(){
  setUseAction.cancel();
});
