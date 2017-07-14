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
function debounce(func, wait) {
  // 这里生产了一个不销毁的私有作用域
  // 每一次mousemove行为触发都会来这里找func，wait和timeout
  var timeout;
  return function () {
    // 保存调用改函数的this传入func中
    var _this = this;
    var args = arguments;
    clearTimeout(timeout);
    timeout = setTimeout(function () {
      func.apply(_this, args);
    }, wait);
  }
}

// 防抖第三波
container.onmousemove = debounce(getUserAction, 500);