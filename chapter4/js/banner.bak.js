/**
 * Created by jerry on 2017/6/21.
 */

// 首先明确，我不想让我写的函数去私有的全局作用域读变量

~function () {
  // 第零步：初始化
  // 以后拿元素页面能加ID就加id，不要套路太深的取拿dom元素！
  var banner = document.getElementById("banner");
  var inner = utils.firstChild(banner);
  var ul = document.getElementById("bannerTip");
  var lis = ul.getElementsByTagName("li");
  var bleft = document.getElementById("bannerLeft");
  var bright = document.getElementById("bannerRight");

  // 第一步：远程获取数据
  var data = null,
    count = 0; // 轮播图片的数量：ajax请求回来的数量+1(实现无缝图片衔接)
  // 重复记忆一遍xhr配置吧：先实例一个xhr对象
  var xhr = new XMLHttpRequest;
  // 配置xhr的open属性
  xhr.open("get", "./json/data.json", true);
  // 兼听onreadystatechange事件
  xhr.onreadystatechange = function handlerXHR() {
    if (xhr.readyState === 4 && /^2\d\d$/.test(xhr.status)) {
      data = utils.jsonParse(xhr.responseText);
      bind(data);
      count = data.length + 1;
      setImgBoxWidth(inner, 990, count); // 为了实现图片无缝衔接，把第0张重复的排列的末尾，所以是length+1
      // 感觉这个延迟加载好图，而且还只延迟显示一张！
      window.setTimeout(function () {
        imgDelyLoad(inner);
      }, 300);

    }
  };
  // 发送请求
  xhr.send(null);

  // 第二步：数据绑定, 整成个函数把，异步就这样，你的满足它~
  function bind(data) {
    var sbImgs = '', // 我还是怀念C#中StringBuild类
      sbLis = '';
    for (var i = 0, len = data.length; i < len; i++) {
      sbImgs += '<div><img src="" rsrc="' + data[i]["img"] + '" alt="' + data[i]["desc"] + '" imgIndex="' + i + '"></div>';
      i === 0 ? sbLis += '<li class="bg"></li>' : sbLis += '<li></li>'; // 为第一个li加上选中样式
    }
    // 为了实现无缝轮播图，得再把第一张图复制一份排列在末尾
    sbImgs += '<div><img src="" rsrc="' + data[0]["img"] + '" alt="' + data[0]["desc"] + '" imgIndex="' + 0 + '"></div>';
    inner.innerHTML = sbImgs;
    ul.innerHTML = sbLis;
  }

  // 第三步：设置图片轮播盒子的宽度：length+1
  function setImgBoxWidth(container, imgw, count) {
    utils.css(container, 'width', imgw * count);
  }

  // 第四步：实现延迟加载
  // 为了延迟加载，先把原img的src改到rsrc自定义属性中再隐藏img，然后再设置img盒子div一个默认背景占位图
  // 这里延迟加载的只是默认占位图替换到真实图片时的延迟加载
  function imgDelyLoad(container) {
    container = container || inner || null;
    var timg = null;
    for (var i = 0, len = count; i < len; i++) {
      var curImg = container.getElementsByTagName('img')[i];
      if (i === 0) { // 也就给第一张整个延迟加载逐渐显示的效果~
        // 我发现现在不需要闭包给异步函数存值了！！！
        timg = new Image;
        timg.src = container.getElementsByTagName('img')[0].getAttribute('rsrc');
        timg.onload = function validImg() {
          // DOM兄，你的getElementsByTagName方法每次执行后返回的类数据顺序变了劳资就完蛋了哈，你看着办，不能变~
          container.getElementsByTagName('img')[0].src = container.getElementsByTagName('img')[0].getAttribute('rsrc');
          utils.css(container.getElementsByTagName('img')[0], 'opacity', 0); //异步初始化透明度0
          container.getElementsByTagName('img')[0].style.display = 'block'; //对，你显示了，但劳资给你设置透明度0，你小子还是不显示，哈哈。
          //完全在炫技，没有实际价值，这老师杂教的啊！靠~
          moveAnimate(container.getElementsByTagName('img')[0], {opacity: 1}, 1000, 10, autoPlayImg); //执行轮播回调
        }
        //// 这闭包用的很淫荡，但有点浪费内存，反正也就几张图片而已。
        //// 这里闭包可以把外面的变量i的地址先存在闭包里，不销毁，等待onload函数执行时去外层闭包找i变量地址的值！
        //~function (i) {
        //  timg = new Image;
        //  timg.src = curImg.getAttribute('rsrc');
        //  timg.onload = function validImg() {
        //    // DOM兄，你的getElementsByTagName方法每次执行后返回的类数据顺序变了劳资就完蛋了哈，你看着办，不能变~
        //    curImg.src = curImg.getAttribute('rsrc');
        //    utils.css(curImg,'opacity',0); //异步初始化透明度0
        //    curImg.style.display = 'block'; //对，你显示了，但劳资给你设置透明度0，你小子还是不显示，哈哈。
        //    moveAnimate(curImg, {opacity: 1}, 1600, 10); //完全在炫技，没有实际价值，这老师杂交的啊！靠~
        //  }
        //}(i);
      } else { // 除了第一张以外，直接给url，直接显示，动画不加了，有没句柄在监测啊！
        curImg.src = curImg.getAttribute('rsrc');
        curImg.style.display = 'block';
      }
    }
  }

  // 第五步：实现轮播动画，哥突然发现个业务，论坛的基础得图片异步加载懒加载完吧~~~
  //        也就是说，这个定时器的开始时间最好是懒加载完，也就是说把这个放在第一张图片整的加载完的动画回调函数里吧
  //        算了，还是用一下私有作用域下的公共变量吧！，反正是私有作用域下的，怕啥！
  var imgIndex = 0;
  // autoTimer 轮播动画的开关
  var autoTimer = window.setInterval(autoPlayImg, 1000);

  function autoPlayImg(interval) {
    interval = typeof interval === 'undefined' ? 800 : interval;
    console.log("动画里的" + imgIndex);
    // 首先记得把定时器放在轮播容器的自定义属性上，也就是放在inner盒子的自定义属性上吧！
    // 这个无缝图片轮播应用到了欺骗眼睛的技术
    //imgIndex++;  // 如果图片索引放开头会有问题！我得找找看！
    if (imgIndex >= count - 1) {
      imgIndex = 0;
      utils.css(inner, 'left', 0);
    }
    imgIndex++;
    moveAnimate(inner, {left: (-imgIndex * 990)}, 2000, 10, changeTip);
  }

  // 第六步：实现焦点对齐
  // 原理：也就是简单改变一下li的选中样式的序号，0，1，2，3，4，0，1，2，3，4，0，1......
  // 步骤：使用图片轮播索引判断，如果轮播图索引大于li元素个数吗，大于就说明调到无缝衔接多加的那个图，那个图应该是0号图；如果没大于就将图片轮播索引赋值给tempIndex索引
  // 原理：轮播图索引定位li的选中样式，如果轮播索引已经大于li数组可选中序数的样式则置0，否则就按轮播图索引设置li选中样式
  function changeTip() {
    var tempIndex = imgIndex > lis.length - 1 ? 0 : imgIndex;
    for (var i = 0, len = lis.length; i < len; i++) {
      var cur = lis[i];
      i === tempIndex ? cur.className = "bg" : cur.className = "";
    }
  }

  // 第七步：停止和开启自动轮播
  banner.onmouseover = function stopAutoPlay() {
    window.clearInterval(autoTimer);
    bleft.style.display = "block";
    bright.style.display = "block";
  };
  banner.onmouseout = function startAutoPlay() {
    autoTimer = window.setInterval(autoPlayImg, 1000);
    bleft.style.display = "none";
    bright.style.display = "none";
  };

  // 第八步：单击焦点实现轮播图的切换
  ul.onclick = function handlerLiClick(e) {
    e = e || window.event;
    e.target = e.target || e.srcElement;
    if (e.target.nodeName === "LI") {
      // 设置图片轮播索引为所点击li对应的那张
      imgIndex = utils.index(e.target);
      changeTip(); // 改变li选中样式到对应的序号上
      moveAnimate(inner, {left: -imgIndex * 990}, 400, 10);
    }
  };

  // 第九步：实现左右轮播图
  // 向右滑动其实就是启动一次动画
  bright.onclick = autoPlayImg;
  bleft.onclick = function turnImgLeftHandler () {
    console.log('imgIndex    '+imgIndex)
    console.log('autoTimer    '+autoTimer)
    if (imgIndex <= 0) { // 如果是第一张
      imgIndex = count - 1; // 等于赋值包含多了一张轮播图的数量-1，也就是实际最后一张图
      utils.css(inner, 'left', -imgIndex * 990);
    }
    imgIndex--; // 控制轮播索引减一
    moveAnimate(inner, {left: -imgIndex * 990}, 2000, 10);
    changeTip();
  };

  // 轮播图优化一：监听窗口是否正被打开，没有就停止轮播动画
  // 设置document的监听事件visibilityChangeEvent
  // var hiddenProperty = 'hidden' in document ? 'hidden' : 'webkitHidden' in document ? 'webkitHidden' : 'mozHidden' in document ? 'mozHidden' : null;
  // // 设置监听句柄名称
  // var visibilityChangeEvent = hiddenProperty.replace(/hidden/i, 'visibilitychange');
  // var onVisibilityChange = function () {
  //   if (!document[hiddenProperty]) {
  //     autoTimer = window.setInterval(autoPlayImg, 3000);
  //   } else {
  //     window.clearInterval(autoTimer);
  //   }
  // };
  // document.addEventListener(visibilityChangeEvent, onVisibilityChange);




}();