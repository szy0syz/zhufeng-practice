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
    getDataBind: getDataBind
  };

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

  // 3. 图片延迟加载(小心异步，也放在取回数据时延迟加载)
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
          moveAnimate(cur.parentNode, {opacity: 1}, 1000, 10);
        }
      } else { // 这里要不要延迟500ms再去加载呢,应该仿小米官网的做！
        utils.firstChild(divs[i]).src = utils.firstChild(divs[i]).getAttribute("data-src");
      }
    }
  }

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
        lis = self.ul.getElementsByTagName('li');
        // 延迟加载图片
        self.imgDelyLoad();
      }
    };
    xhr.send(null);
  }

  function init () {
    this.getDataBind();
  }

  window.SliderEaseIn = Slider

}();