/**
 * Created by jerry on 2017/6/22.
 */

~function () {
  // 0.初始化变量
  var banner = document.getElementById('banner');
  var inner = document.getElementById('inner');
  var ul = document.getElementById('bannerTip');
  var lis = null; // 异步拼接的，别急，后面再拿！
  var leftNav = document.getElementById('bannerLeft');
  var rightNav = document.getElementById('bannerRight');

  // 1. 配置ajax，异步远程拿数据
  var xhr = new XMLHttpRequest;
  xhr.open("get", "./json/data.json", true);
  xhr.onreadystatechange = function ajaxHandler() {
    if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
      var data = xhr.responseText;
      if (typeof data === 'undefined') {
        console.error('ajax远程获取图片加载对象失败');
      }
      data = utils.jsonParse(data);
      // 该绑定数据
      bind(data);
      lis = ul.getElementsByTagName('li');
      // 延迟加载图片
      imgDelyLoad();
    }
  };
  xhr.send(null);

  // 2. 数据绑定
  function bind(data) {
    var sbImgs = '', // 我还是怀念C#中StringBuild类
      sbLis = '';
    for (var i = 0, len = data.length; i < len; i++) {
      sbImgs += '<div><img src="" rsrc="' + data[i]["img"] + '" alt="' + data[i]["desc"] + '"></div>';
      i === 0 ? sbLis += '<li class="bg"></li>' : sbLis += '<li></li>'; // 为第一个li加上选中样式
    }
    inner.innerHTML = sbImgs;
    ul.innerHTML = sbLis;
  }

  // 3. 图片延迟加载(小心异步，也放在取回数据时延迟加载)
  function imgDelyLoad() {
    var tmpimg = null;
    var divs = inner.getElementsByTagName('div');
    for (var i = 0, len = utils.children(inner).length; i < len; i++) {
      if (i === 0) {
        tmpimg = new Image;
        tmpimg.src = utils.firstChild(divs[0]).getAttribute("rsrc");
        tmpimg.onload = function validImg() {
          // 这里可是异步空间哦~~ 坑不到我的！
          var cur = inner.getElementsByTagName('img')[0];
          cur.src = cur.getAttribute("rsrc");
          cur.style.display = 'block';
          utils.css(cur.parentNode, 'z-index', 1);
          // 这里要开始设置动画了，要统一才行
          moveAnimate(cur.parentNode, {opacity: 1}, 1000, 10);
        }
      } else { // 这里要不要延迟500ms再去加载呢
        utils.firstChild(divs[i]).src = utils.firstChild(divs[i]).getAttribute("rsrc");
      }
    }
  }

  // 4.实现轮播
  var imgIndex = 0,
    autoTimer = null,
    interval = 4000;

  window.setTimeout(function () {
    autoTimer = window.setInterval(autoPlay, interval);
  }, 800);

  function autoPlay() {
    if (imgIndex >= (lis.length - 1)) { // 这里已经延迟了800ms，应该异步拿到了lis!
      imgIndex = -1; // 因为后面还要加1, -1+1=0, 正好是第一张！
    }
    imgIndex++;
    // 确保动画执行前轮播指针指向必须在有效范围内！
    imgIndex = imgIndex < 0 ? 0 : imgIndex;
    setBanner();
  }

  //
  function setBanner() {
    // 让imgIndex所指向的div的zIndex为1且第一个子元素display为block且透明度动画效果变为1，其它的div透明度变为0且zIndex为0且第一个子元素display为none
    var divs = inner.getElementsByTagName('div');
    for (var i = 0, len = divs.length; i < len; i++) {
      if (imgIndex === i) {
        utils.css(divs[i], {zIndex: 1});
        utils.children(divs[i])[0].style.display = 'block';
        //重点来了
        moveAnimate(divs[i], {opacity: 1}, 400, 10, function () {
          console.log("img index:" + utils.index(this));
          //此时才是重点：等轮播到的图片透明度完毕变为1后才把原来透明度1的图片设置为0透明度
          // 我靠，img没得兄弟元素！我是踩坑王。这里this是包img的那个div
          utils.siblings(this).forEach(function (item) {
            utils.children(item)[0].style.display = 'none';
            utils.css(item, {opacity: 0});
          })
        });
        continue;
      } //好tm神奇，这个zindex放动画里最后一张循环到第一张时渐显效果竟然没有，其他时候有！！牛逼！！！无语！！！
      utils.css(divs[i], 'z-index', 0);
    }
    ///////////////////////////////////
    // 5.实现焦点对齐 focusAlign
    for (var k = 0, len0 = lis.length; k < len0; k++) {
      if (k === imgIndex) {
        utils.addClass(lis[k], 'bg');
        utils.siblings(lis[k]).forEach(function (curLi) {
          utils.removeClass(curLi, 'bg');
        });
        break; // 不需要再去循环了
      }
    }
  }

  // 6. 实现点击焦点切换
  // 注意：这里li是异步加载，哥哥你根本绑定不上onclick事件的！要绑定就绑ul，dom骨架本身就有的元素！
  function focusTurnHandler (ev) {
    ev = ev || window.event;  // 为了兼容mozilla和ie核心的浏览器！
    ev.target = ev.target || ev.srcElement;
    if(ev.target.nodeName === 'LI') {
      // 获取所点击li在同辈元素中排行老几~
      console.dir(ev.target);
      console.log("你所点击的li在家中排行： 第" + utils.index(ev.target));
      imgIndex = utils.index(ev.target)-1; // 设置轮播索引时为啥要减一呢？坑爹？因为了嘛
      autoPlay();
    }
  }
  ul.addEventListener('click', focusTurnHandler);


  // 7. 实现silder左右切换




}();