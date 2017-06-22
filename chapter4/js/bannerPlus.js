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
    // 为了实现无缝轮播图，得再把第一张图复制一份排列在末尾
    sbImgs += '<div><img src="" rsrc="' + data[0]["img"] + '" alt="' + data[0]["desc"] + '"></div>';
    inner.innerHTML = sbImgs;
    ul.innerHTML = sbLis;
  }

  // 3. 图片延迟加载(小心异步，也放在取回数据时延迟加载)
  function imgDelyLoad() {
    var timg = null;
    var divs = inner.getElementsByTagName('div');
    for (var i = 0, len = utils.children(inner).length; i < len; i++) {
      if (i === 0) {
        timg = new Image;
        timg.src = utils.firstChild(divs[0]).getAttribute("rsrc");
        timg.onload = function validImg() {
          // 这里可是异步空间哦~~
          var cur = inner.getElementsByTagName('img')[0];
          cur.src = cur.getAttribute("rsrc");
          // 设置显示不设置img，设置div
          cur.parentNode.style.display = 'block';
          utils.css(cur.parentNode, 'z-index', 1);
          // 这里要开始设置动画了，要统一才行
          moveAnimate(cur.parentNode, {opacity: 1}, 2000, 10);
        }
      } else { // 这里要不要延迟500ms再去加载呢
        utils.firstChild(divs[i]).src = utils.firstChild(divs[i]).getAttribute("rsrc");
      }
    }
  }

  // 4. 实现轮播
  var imgIndex = 0,
      autoTimer = null,
      interval = 2000;
  window.setTimeout(function () {
    autoTimer = window.setInterval(autoPlay, interval);
  }, 1100);

  function autoPlay() {
    if (imgIndex === (lis.length-1)) { // 这里已经延迟了1.1秒，应该异步拿到了lis!
      imgIndex = -1; // 因为后面还要加1
    }
    imgIndex++;
    setBanner();
  }

  //
  function setBanner() {
    //1. 让imgIndex所指向的div透明度变为1，且zIndex为1，其它的div透明度变为0，zIndex为0；
    var divs = inner.getElementsByTagName('div');
    for (var i = 0, len = divs.length; i < len; i++) {
      if (imgIndex === i) {
        utils.css(divs[i], {zIndex: 1});
        //重点来了
        moveAnimate(divs[i], {opacity: 1}, 300, 10, function () {
          console.log("img index:" + utils.index(this));
          //此时才是重点：等轮播到的图片透明度完毕变为1后才把原来透明度1的图片设置为0透明度
          // 我靠，img没得兄弟元素！我真实踩坑王
          utils.siblings(this).forEach(function (item) {
            console.log(item)
            utils.css(item, {opacity: 0});
          })
        });
        continue;
      }
      utils.css(divs[i],'zIndex',0);
    }

  }

}();