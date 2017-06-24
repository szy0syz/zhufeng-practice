/**
 * Created by jerry on 2017/6/23.
 */

~function () {

  // 类的构造函数Slider
  function Slider(e, i, u) {
    // e = element id
    // i = interval
    // u = ajax url
    this.banner = document.getElementById(e); // 我靠，元素还是自己在类库里api获取，要不然好诡异的事情都发生！
    this.inner = utils.firstChild(banner);
    this.ul = banner.getElementsByTagName('ul')[0];
    this.lis = null; // 异步拼接的，别急，后面再拿！
    this.leftNav = banner.getElementsByTagName('a')[0];
    this.rightNav = banner.getElementsByTagName('a')[1];
    this.imgIndex = 0;
    this.autoTimer = null;
    this.interval = i;
    this.dataUrl = u;
  }

  Slider.prototype = {
    constructor: Slider,
    init: init,
    bind: bind,
    imgDelyLoad:imgDelyLoad,
    getDataBind: getDataBind,
    autoPlay: autoPlay,
    setBanner:setBanner,
    showNav: showNav,
    focusAlign:focusAlign,
    turnOn:turnOn
  };

  // 绑定数据
  function bind(data) {
    //console.dir(this);
    var sbImgs = '', // 我还是怀念C#中StringBuild类
      sbLis = '';
    for (var i = 0, len = data.length; i < len; i++) {
      sbImgs += '<div><img src="" data-src="' + data[i]["img"] + '" alt="' + data[i]["desc"] + '"></div>';
      i === 0 ? sbLis += '<li class="bg"></li>' : sbLis += '<li></li>'; // 为第一个li加上选中样式
    }
    this.inner.innerHTML = sbImgs;
    this.ul.innerHTML = sbLis;
  }

  // 图片延迟加载(小心异步，也放在取回数据时延迟加载)
  function imgDelyLoad() {
    var self = this;
    var tmpimg = null;
    var divs = this.inner.getElementsByTagName('div');
    for (var i = 0, len = utils.children(this.inner).length; i < len; i++) {
      if (i === 0) {
        tmpimg = new Image;
        tmpimg.src = utils.firstChild(divs[0]).getAttribute("data-src");
        tmpimg.onload = function validImg() {
          // 这里可是异步空间哦~~ 坑不到我的！
          var cur = self.inner.getElementsByTagName('img')[0];
          cur.src = cur.getAttribute("data-src");
          cur.style.display = 'block';
          utils.css(cur.parentNode, 'z-index', 1);
          // 这里要开始设置动画了，要统一才行
          moveAnimate(cur.parentNode, {opacity: 1}, 500, 10);  // 这里控制首图延迟加载的时间
        }
      } else { // 这里要不要延迟500ms再去加载呢,应该仿小米官网的做！
        utils.firstChild(divs[i]).src = utils.firstChild(divs[i]).getAttribute("data-src");
      }
    }
  }

  // 获取数据并绑定数据
  function getDataBind () {
    var self = this;
    var xhr = new XMLHttpRequest;
    xhr.open("get", this.dataUrl, true);
    xhr.onreadystatechange = function ajaxHandler() {
      if (xhr.readyState === 4 && /^2\d{2}$/.test(xhr.status)) {
        var data = xhr.responseText;
        if (typeof data === 'undefined') {
          console.error('ajax远程获取图片加载对象失败');
        }
        data = utils.jsonParse(data);
        self.bind(data);// 该绑定数据
        self.lis = self.ul.getElementsByTagName('li');
        // 延迟加载图片
        self.imgDelyLoad();
      }
    };
    xhr.send(null);
  }

  // 4.实现轮播
  function autoPlay() {
    if (this.imgIndex >= (this.lis.length - 1)) {
      this.imgIndex = -1; // 因为后面还要加1, -1+1=0, 正好是第一张！
    }
    this.imgIndex++;
    // 确保动画执行前轮播指针指向必须在有效范围内！
    this.imgIndex = this.imgIndex < 0 ? 0 : this.imgIndex;
    this.setBanner();
  }

  //实际的图片渐显动画函数
  function setBanner() {
    // 让imgIndex所指向的div的zIndex为1且第一个子元素display为block且透明度动画效果变为1，其它的div透明度变为0且zIndex为0且第一个子元素display为none
    var divs = this.inner.getElementsByTagName('div');
    for (var i = 0, len = divs.length; i < len; i++) {
      if (this.imgIndex === i) {
        utils.css(divs[i], {zIndex: 1});
        utils.children(divs[i])[0].style.display = 'block';
        //重点来了
        moveAnimate(divs[i], {opacity: 1}, 400, 10, function () {
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
    for (var k = 0, len0 = this.lis.length; k < len0; k++) {
      if (k === this.imgIndex) {
        utils.addClass(this.lis[k], 'bg');
        utils.siblings(this.lis[k]).forEach(function (curLi) {
          utils.removeClass(curLi, 'bg');
        });
        break; // 不需要再去循环了
      }
    }
  }

  // 6. 鼠标进入显示左右nav按钮
  function showNav() {
    var self = this;
    self.banner.onmouseover = function (ev) {
      window.clearInterval(self.autoTimer);
      self.leftNav.style.display = "block";
      self.rightNav.style.display = "block";
    };
    this.banner.onmouseout = function (ev) {
      self.autoTimer = window.setInterval(function () {self.autoPlay()}, self.interval);
      self.leftNav.style.display = "none";
      self.rightNav.style.display = "none";
    };
  }

  // 7. 实现点击焦点切换
  function focusAlign () {
    var self = this;
    this.ul.onclick = function (ev) {
      ev = ev || window.event;  // 为了兼容mozilla和ie核心的浏览器！
      ev.target = ev.target || ev.srcElement;
      if (ev.target.nodeName === 'LI') {
        // 获取所点击li在同辈元素中排行老几~
        self.imgIndex = utils.index(ev.target) - 1; // 设置轮播索引时为啥要减一呢？坑爹？因为了嘛
        self.autoPlay();
      }
    }
  }

  // 8. 实现silder左右切换
  function turnOn () {
    var self = this;
    //this.rightNav.addEventListener('click', this.autoPlay);
    // 原来是上面那样执行，但这样this就会变成锚点a标签，必须想办法将this类实例对象带入，
    //    则开辟一个私有作用域且嵌套在turnOn作用域中，则被嵌套的私有作用域就可以通过作用域链找到self指针
    this.rightNav.addEventListener('click', function () {
      self.autoPlay();
    });
    this.leftNav.addEventListener('click', function () {
      if (self.imgIndex === 0) {
        self.imgIndex = self.lis.length;
      }
      self.imgIndex--;
      self.setBanner();
    });
  }

  // 初始化
  function init () {
    var self = this;
    this.getDataBind();
    window.setTimeout(function () {
      self.autoTimer = window.setInterval(function () {
        self.autoPlay();
        //提升体验：修改div.inner的背景图，不要让用户看到默认占位图两次！
        var fisrtSliderImg = self.inner.getElementsByTagName('img')[0].src;
        // 以后可以升级的我类库了！！！这里要升级！
        utils.css(self.inner, 'backgroundImage', 'url(' + fisrtSliderImg + ')');
      }, self.interval);
    },550);
    this.showNav();
    this.focusAlign();
    this.turnOn();
  }

  window.SliderEaseIn = Slider

}();