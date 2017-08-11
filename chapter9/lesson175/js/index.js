var navmain = document.getElementById('nav-main');
var listA = utils.children(navmain,'a');

var navHoverHandle = function navHoverHandle(e) {
  // 注意：这里所触发事件的元素已限定是a标签
  e = e || window.event;
  e. target = e. target || e.srcElement;
  if (e.type === 'mouseenter') {
    utils.addClass(utils.children(e.target, 'i')[0], 'nav-hover');
    e.target.style.opacity = 1;
  } else {
    utils.removeClass(utils.children(e.target, 'i')[0], 'nav-hover');
    e.target.style.opacity = 0.8;
  }
};

for (var i=0, len = listA.length; i < len; i++) {
  listA[i].addEventListener('mouseenter', navHoverHandle);
  listA[i].addEventListener('mouseleave', navHoverHandle);
}


