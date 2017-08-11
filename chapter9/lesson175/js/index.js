var navmain = document.getElementById('nav-main');
var listA = utils.children(navmain,'a');

var navHoverHandle = function navHoverHandle(e) {
  e = e || window.event;
  e. target = e. target || e.srcElement;
  if (e.type === 'mouseenter') {
    utils.addClass(utils.children(e.target, 'i')[0], 'nav-hover');
  } else {
    utils.removeClass(utils.children(e.target, 'i')[0], 'nav-hover');
  }
};

for (var i=0, len = listA.length; i < len; i++) {
  listA[i].addEventListener('mouseenter', navHoverHandle);
  listA[i].addEventListener('mouseleave', navHoverHandle);
}


