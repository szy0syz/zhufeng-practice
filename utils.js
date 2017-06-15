/**
 * Created by jerry on 2017/6/15.
 */

var utils = (function () {
  // 判断当前浏览器环境是否是ie6~8
  var flag = "getComputedStyle" in window;

  // 类数据转换成数组
  function listToArray(similarArray) {
    if (!flag) {
      return Array.prototype.slice.call(similarArray);
    }
    var arr = [];
    for (var i = 0, len = similarArray.length; i < len; i++) {
      // 没有数组塌陷，安心用。
      arr[arr.length] = similarArray[i];
    }
    return arr;
  }

  // 将字符串转换为对象
  function jsonParse(jsonStr) {
    return 'JSON' in window ? JSON.parse(jsonStr) : eval('(' + jsonStr + ')');
  }

  // 获取元素距离body的绝对距离
  function offset(curElement) {
    var totalLfet = 0, totalTop = 0, parant = curElement.offsetParent
    // 先算自己的
    totalLfet += curElement.offsetLeft
    totalTop += curElement.offsetTop

    while (parant) {
      // 判断是不是IE8
      if (window.navigator.userAgent.indexOf("MSIE 8.0") === -1) {
        // 累加父级参照物的边框
        totalLfet += parant.clientLeft
        totalTop += parant.clientTop
      }
      // 累加父级外边框到上级参照物的距离
      totalLfet += parant.offsetLeft
      totalTop += parant.offsetTop
      // 重新设置父级参照物
      parant = parant.offsetParent
    }
    return {left: totalLfet, top: totalTop}
  }

  // 获取或设置html+body的属性
  function win(attr, val) {
    if (val === undefined) {
      var first = document.documentElement[attr];
      var second = document.body[attr];
      // 排除css中给html或者body设置类似height:500%属性的情况
      if (first > second) {
        return second;
      }
      return first || second;
    }
    document.documentElement[attr] = val;
    document.body[attr] = val;
  }

  // 获取元素当前所有经过浏览器计算渲染过的样式中的[attr]对应的值(兼容(ie6~8))
  function getComputedCss(curEle, attr) {
    var val = null;
    var reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/
    if (flag) {
      val = window.getComputedStyle(curEle, null)[attr];
    } else {  // -> 如果是IE6~8
      if (attr === 'opacity') {
        val = curEle.currentStyle[attr]; // .currentStyle属性为IE专用
        // 正则解释：alpha开头，小括号字符需要用转义符转义，然后括号里是1到1位数字，后面小数部分可有可无，里面?:表示第三个小括号内容不捕获，最后忽略大小写
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
        // 先匹配，在捕获到第一个小正则内容，如果不是就返回1
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1; // exec捕获返回数组，index=1位第一个小正则捕获的内容
      } else {
        val = curEle.currentStyle[attr];
      }
    }
    return reg.test(val) ? parseFloat(val) : val;  // 只返回数值!正则匹配的是复合值,如padding background, floaf...
  }

  // 获取元素的所有子元素节点，可以通过tagName筛选
  function children (curEle, tagName) {
    var arr = [];
    var flag = /MSIE [6|7|8]/.test(window.navigator.userAgent);
    if (flag) {
      var cnodes = utils.listToArray(curEle.childNodes);
      cnodes.forEach(function (item) {
        // 先亲子鉴定！！！再鉴定nodeType是不是元素节点，元素节点为1
        if (item.parentNode === curEle && item.nodeType === 1) {
          arr[arr.length] = item;
        }
      })
    } else {
      arr = utils.listToArray(curEle.children);
    }
    if (tagName !== undefined) {
      for (var j = 0; j < arr.length; j++) {
        // 循环找tabName不匹配的元素
        if(arr[j].tagName.toLowerCase() !== tagName.toLowerCase()) {
          // 找到不匹配的元素就删除
          arr.splice(j, 1);
          // 恢复索引, 若恢复索引会出现数组塌陷问题
          j--;
        }
      }
    }
    return arr;
  }

  //获取元素的哥哥元素节点
  function prev(curEle) {
    var bro = curEle.previousSibling  // 获取元素的哥哥节点
    while (bro) {
      if (bro.nodeType === 1) { //判断是不是元素
        return bro
      }
      bro = bro.previousSibling
    }
    return null
  }

  // 获取元素的弟弟元素元素
  function next (curEle) {
    var bro = curEle.nextSibling  // 获取元素的哥哥节点
    while (bro) {
      if (bro.nodeType === 1) { //判断是不是元素
        return bro
      }
      bro = bro.nextSibling
    }
    return null
  }

  // 获取元素的所有哥哥元素
  function prevAll (curEle) {
    var arr = []
    var bro = this.prev(curEle)
    while(bro !== null) {
      arr.unshift(bro)  // 存放哥哥元素时最大的哥哥排在数组最前面
      bro = this.prev(bro)
    }
    return arr
  }

  // 获取元素的所有弟弟元素
  function nextAll (curEle) {
    var arr = []
    var bro = this.next(curEle)
    while(bro !== null) {
      arr.push(bro)  // 存放哥哥元素时最大的哥哥排在数组最前面
      bro = this.next(bro)
    }
    return arr
  }

  // 获取元素的一个哥哥元素和弟弟元素
  function sibling (curEle) {
    var arr = []
    arr.push(this.prev(curEle)) //如果有哥哥，没有就null
    arr.push(this.next(curEle)) //如果有弟弟，没有就null
    return arr
  }

  // 获取元素的所有兄弟元素节点
  function siblings (curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle))
  }

  // 获取元素在同辈中的索引
  function index (curEle) {
    return this.prevAll(curEle).length
  }

  // 获取元素的第一个子元素
  function firstChild (curEle) {
     var ec = this.children(curEle)
     return ec[0] ? ec[0] : null
  }

  // 获取元素的最后一个子元素
  function lastChild (curEle) {
    var ec = this.children(curEle)
    return ec[ec.length - 1] ? ec[ec.length - 1] : null
  }

  return {
    listToArray: listToArray,
    jsonParse: jsonParse,
    offset: offset,
    win: win,
    getComputedCss: getComputedCss,
    children: children,
    prev: prev,
    next: next,
    prevAll: prevAll,
    nextAll: nextAll,
    sibling: sibling,
    siblings: siblings,
    index: index,
    firstChild: firstChild,
    lastChild: lastChild
  }
})()