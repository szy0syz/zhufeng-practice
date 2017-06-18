/**
 * Created by jerry on 2017/6/18.
 */

//构造函数方式实现

~function () {

  function Tab () {

  }

  Tab.prototype = {
    constructor: Tab,
    // 初始化
    init: initTab
  }

  function initTab (container, defaultIndex) {
    var ul = utils.firstChild(container);
    setDefaultItem(container, defaultIndex);
    ul.onclick = function (e) {
      // 获取event的保险写法，有些浏览器如果参数e没赋值，会在window.event上有这次点击的event对象
      // 如果实参e在函数参数上没获取到，就去window.event上获取
      e = e || window.event;
      // 如果e的target为undefined则用e.srcElement赋值
      e.target = e.target || e.srcElement;
      // 如果所点击的是ul下的li元素
      if(e.target.tagName.toLowerCase() === 'li') {
        // 还是调用原来的方法，只是改变了this
        tabClickHandler.call(e.target);
      }
    }
  }

  function tabClickHandler () {
    var self = this;
    // 获取所点击元素li在同辈中排行老几！
    var index = utils.index(self);
    // 获取点击li的所有兄弟元素节点，然后循环删除selected样式类名
    utils.siblings(self).forEach(function (cur) {
      utils.removeClass(cur, 'selected');
    });
    // 给点击li添加选中样式类名
    utils.addClass(self, 'selected');
    // 获取与点击li在同辈排行序号相同的div元素
    var curDiv = utils.nextAll(this.parentNode)[index];
    // 循环这个div的所有兄弟元素并删除选中样式
    utils.siblings(curDiv).forEach(function (cur) {
      utils.removeClass(cur, 'selected');
    });
    // 给对应div添加选中样式
    utils.addClass(curDiv, 'selected');
    self = null;
    index = null;
  }

  function setDefaultItem (container, defaultIndex, className) {
    if (container === undefined) return null;
    defaultIndex = defaultIndex || 0;
    className = className || "selected";
    // 获取ul元素后再获取它的所有子元素li
    var oLis = utils.children(utils.firstChild(container), 'li');
    var oDivs = utils.children(container, 'div');
    for (var i=0, len=oLis.length; i<len; i++) {
      if (i === defaultIndex) {
        utils.addClass(oLis[i], className);
        utils.addClass(oDivs[i], className);
      } else {
        utils.removeClass(oLis[i], className);
        utils.removeClass(oDivs[i], className);
      }
    }
  }

  function clearSiblingsClassName (ele, className) {
    utils.siblings(ele).forEach(function (item) {
      utils.removeClass(item, className)
    })
  }

  window.Tab = Tab
}()