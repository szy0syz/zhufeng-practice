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
    totalLfet += curElement.offsetLeft;
    totalTop += curElement.offsetTop;

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
      if (first !==0 && first > second)  {
        return first;
      }
      return first || second;
    }
    document.documentElement[attr] = val;
    document.body[attr] = val;
  }

  // 获取元素的所有子元素节点，可以通过tagName筛选
  function children(curEle, tagName) {
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
        if (arr[j].tagName.toLowerCase() !== tagName.toLowerCase()) {
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
  function next(curEle) {
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
  function prevAll(curEle) {
    var arr = []
    var bro = this.prev(curEle)
    while (bro !== null) {
      arr.unshift(bro)  // 存放哥哥元素时最大的哥哥排在数组最前面
      bro = this.prev(bro)
    }
    return arr
  }

  // 获取元素的所有弟弟元素
  function nextAll(curEle) {
    var arr = []
    var bro = this.next(curEle)
    while (bro !== null) {
      arr.push(bro)  // 存放哥哥元素时最大的哥哥排在数组最前面
      bro = this.next(bro)
    }
    return arr
  }

  // 获取元素的一个哥哥元素和弟弟元素
  function sibling(curEle) {
    var arr = []
    arr.push(this.prev(curEle)) //如果有哥哥，没有就null
    arr.push(this.next(curEle)) //如果有弟弟，没有就null
    return arr
  }

  // 获取元素的所有兄弟元素节点
  function siblings(curEle) {
    return this.prevAll(curEle).concat(this.nextAll(curEle))
  }

  // 获取元素在同辈中的索引
  function index(curEle) {
    return parseFloat(this.prevAll(curEle).length).toFixed();
  }

  // 获取元素的第一个子元素
  function firstChild(curEle) {
    var ec = this.children(curEle)
    return ec[0] ? ec[0] : null
  }

  // 获取元素的最后一个子元素
  function lastChild(curEle) {
    var ec = this.children(curEle)
    return ec[ec.length - 1] ? ec[ec.length - 1] : null
  }

  // 向指定容器的开头追加元素
  function prepend(newEle, container) {
    var fir = this.firstChild(container);
    if (fir) { // 如果容器中有节点
      container.insertBefore(newEle, fir)
      return
    }
    container.appendChild(fir)
  }

  // 把新元素追加到指定元素的前面
  function insertBefore(newEle, oldEle) {
    oldEle.parentNode.insertBefore(newEle, oldEle)
  }

  // 判断元素style属性是否存在某类名
  function hasClass(curEle, className) {
    // 分析需求：
    // 情况1 -> "size" === /^size +/ , 当判断的类名在字符串首位时，就是以某某开头后面可以跟一到多个空格
    // 情况2 -> "center" === / +center +/ ，当判断的类名在字符串中间时，就是以一到多空格开头和结尾中间就是类名
    // 情况3 -> "className" === / +border^/
    // 从以上三种情况分析可得：/(^| +)className( +|&)/
    // 别忘了再给className传入参数左右两边取空格
    var reg = new RegExp('(^| +)?' + className + '( +|&)?')
    return reg.test(curEle.className)
  }

  // 为指定元素添加css类名
  function addClass(curEle, className) {
    // 首先去除参数字符串左右两边的多余空格，然后一定要用正则的split分割
    var classAry = className.trim().split(/ +/g);
    classAry.forEach(function (item) {
      if (!hasClass(curEle, item)) {
        curEle.className += ' ' + item;
      }
    })
  }

  // 为元素删除某些css类名
  function removeClass(curEle, className) {
    // 首先去除参数字符串左右两边的多余空格，然后一定要用正则的split分割
    var classAry = className.trim().split(/ +/g);
    classAry.forEach(function (curClaName) {
      if (hasClass(curEle, curClaName)) { //如果存在则移除
        // 设置正则匹配以className开头或者一到多个空格开头或结尾
        var reg = new RegExp("(?:^| +)" + curClaName + "(?: +|$)", 'g');  // 修复正则，不需要的不捕获！
        curEle.className = curEle.className.replace(reg, " ");
      }
    })
  }

  function getElementsByClassName(className, container) {
    // 如果没传className或者不是字符串则返回空数组
    if (!className && (typeof className !== "string")) {
      return [];
    }
    // 如果没传container容器则默认设为document
    if (!container) {
      container = document;
    }
    var res = [];
    // 使用所有浏览器都兼容的getElementsByTagName方法加通配符获取所有节点
    var elemtnts = container.getElementsByTagName('*');
    // 使用正则分割传递进来的类名字符串成数组
    var classAry = className.trim().split(/ +/g);
    for (var i = 0; i < elemtnts.length; i++) // 循环容器内的元素节点
    { // 假设结果验证为true
      var isValid = true;
      var curEle = elemtnts[i];
      for (var j = 0, len = classAry.length; j < len; j++) {
        // 判断当前元素节点是否有该类名，没有就直接中断内循环设置isValid为false
        if (!hasClass(curEle, classAry[j])) {
          isValid = false;
          break;
        }
      }
      if (isValid) { // 只有当验证通过才将元素加入结果数组
        res.push(elemtnts[i]);
      }
    }
    return res; // 返回结果数组
  }

  // 获取元素当前所有经过浏览器计算渲染过的样式中的[attr]对应的值(兼容(ie6~8))
  function getComputedCss(attr) {
    var val = null;
    var reg = /^-?\d+(\.\d+)?(px|pt|rem|em)?$/
    if (flag) {
      val = window.getComputedStyle(this, null)[attr];
    } else {  // -> 如果是IE6~8
      if (attr === 'opacity') {
        val = this.currentStyle[attr]; // .currentStyle属性为IE专用
        // 正则解释：alpha开头，小括号字符需要用转义符转义，然后括号里是1到1位数字，后面小数部分可有可无，里面?:表示第三个小括号内容不捕获，最后忽略大小写
        reg = /^alpha\(opacity=(\d+(?:\.\d+)?)\)$/i;
        // 先匹配，在捕获到第一个小正则内容，如果不是就返回1
        val = reg.test(val) ? reg.exec(val)[1] / 100 : 1; // exec捕获返回数组，index=1位第一个小正则捕获的内容
      } else {
        val = this.currentStyle[attr];
      }
    }
    return reg.test(val) ? parseFloat(val) : val;  // 只返回数值!正则匹配的是复合值,如padding background, floaf...
  }

  // 设置元素的样式值setCss
  function setCss(attr, value) {
    //处理特殊样式设置
    //特殊1：opacity  (兼容IE6~8)
    if (attr === "opacity") {
      this.style.opacity = value;
      this.style.filter = 'alpha(opacity=' + value * 100 + ')';
      return;
    }
    // 特殊2：float  (兼容IE6~8)
    if (attr === "float") {
      this.style['cssFloat'] = value;
      this.style['styleFloat'] = value;
      return;
    }
    var reg = /^(width|height|top|bottom|left|right|((border|padding)(Top|Bottom|Left|Right)?))$/;
    if (reg.test(attr)) {
      if (!isNaN(value)) { // 判断是否是一个有效数字
        // 如果是一个有效数字，证明传进来的value是没有单位的，则需要我们手工补默认单位px
        value += 'px';
      }
    }
    // 实在是匹配不上了就直接赋值
    this.style[attr] = value;
  }

  // 批量设置元素的样式值
  function setGroupCss(options) {
    options = options || 0; // 如果为undefined则设置为0
    if (Object.prototype.toString.call(options) !== '[object Object]') {
      return;
    }
    // 这里for...in循环时遍历公有+私有
    for (var key in options) {
      // 则必须过滤只循环私有属性
      if (options.hasOwnProperty(key)) {
        setCss.call(this, key, options[key])
      }
    }
  }

  //
  function toggleClass(curEle, className) {
    hasClass(curEle, className) ? removeClass(curEle,className) : addClass(curEle,className);
  }

  //$("#box").css("width")
  //$("#box").css("width", 200)
  //$("#box").css({width: 200, height: 100})
  function css(curEle) {
    // arguments所包含所有传入参数！
    var argSec = arguments[1];
    var argThd = arguments[2];
    if (typeof argSec === 'string') {
      // 如果第二个参数为字符串且第三个参数没传就证明只是获取css属性的值
      if (typeof argThd === 'undefined') {
        return getComputedCss.call(curEle, argSec);
      }
      var argList = this.listToArray(arguments).splice(1);
      // 否则就是单个设置css属性的值
      setCss.apply(curEle, argList)
    }
    argSec = argSec || 0; // 如果是undefined就赋值0
    if (Object.prototype.toString.call(argSec) === '[object Object]') {
      setGroupCss.call(curEle, argSec)
    }
  }


  return {
    listToArray: listToArray,
    jsonParse: jsonParse,
    offset: offset,
    win: win,
    // getComputedCss: getComputedCss,
    children: children,
    prev: prev,
    next: next,
    prevAll: prevAll,
    nextAll: nextAll,
    sibling: sibling,
    siblings: siblings,
    index: index,
    firstChild: firstChild,
    prepend: prepend,
    insertBefore: insertBefore,
    lastChild: lastChild,
    hasClass: hasClass,
    addClass: addClass,
    removeClass: removeClass,
    toggleClass: toggleClass,
    getElementsByClassName: getElementsByClassName,
    // setCss: setCss,
    // setGroupCss: setGroupCss,
    css: css
  }
})()