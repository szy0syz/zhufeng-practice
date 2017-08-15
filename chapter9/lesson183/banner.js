// REM
!function () {
  //设置rem=当前屏幕宽度除以设计稿宽度640*100+'px'
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 640 * 100 + 'px';
}();


var bannerRender = (function () {
  //先获取当前屏幕宽度
  var winW = document.documentElement.clientWidth,
    maxL = 0, // 最大left偏移值就是0了，因为没有因为了！
    minL = 0; // 最小maxL值时负数可变的，在JS计算吧，计算公式就是minL=(imgs.length-1)*winW，就是slide数组-1乘以当前屏幕宽度

  var $banner = $('.banner'),
    $wrapper = $banner.children('.wrapper'),
    $slideList = $wrapper.children('.slide'),
    $imgList = $wrapper.children('img');
  var step = 1; // 设置出事轮播时的第几个图

  var lazyImg = function lazyImg() {
    var $cur = $slideList.eq(step),
      $tar = $cur.add($cur.prev()).add($cur.next()); // 为目标集合中添加当前元素的前一个和后一个，表示这三个都要进行lazyLoading
    $tar.each(function (index, item) { //这里拿到的是img的容器，并不是img
      var $img = $(item).children('img');
      if ($img.attr('isLoad') === '1') {
        return
      }
      var oImg = new Image;
      oImg.src = $img.attr('data-src');
      oImg.onload = function () {
        $img.attr({
          src: this.src,
          isLoad: 1
        }).css('display', 'block');
        oImg = null;
      }
    });
  };

  // 判断是或否发生了swipe滑动
  var isSwipe = function isSwipe(strX, strY, endX, endY) {
    return Math.abs(endX - strX) > 0 || Math.abs(endY - strY) > 0;
  };

  // 判断滑动方向
  var swipeDir = function swipeDir(strX, strY, endX, endY) {
    return Math.abs(endX - strX) >= Math.abs(endY - strY) ? (endX - strX > 0 ? 'right' : 'left') : (endY - strY > 0 ? 'down' : 'up');
  };

  var dragStart = function dragStart(ev) {
    var point = ev.touches[0]; // 手指单击的那个点
    // 这里主要记录当前wrapper的位置，毕竟移动还是看wrapper
    $wrapper.attr({
      strL: parseFloat($wrapper.css('left')), // 注意：不管jQuery还是Zpeto返回的都是带单位的
      strX: point.clientX, // 这里表示手指点的那个坐标X
      strY: point.clientY,
      isMove: 0, // 初始化自定义属性
      dir: null,
      changeX: null
    });
  };

  var dragMove = function dragMove(ev) {
    // 在写move前，我们要判断是否发生了swipe
    var point = ev.touches[0],
      endX = point.clientX,
      endY = point.clientY,
      strX = parseFloat($wrapper.attr('strX')),
      strY = parseFloat($wrapper.attr('strY')),
      strL = parseFloat($wrapper.attr('strL')),
      changeX = endX - strX;
    // 计算是否滑动以及滑动方向
    var isMove = isSwipe(strX, strY, endX, endY),
      dir = swipeDir(strX, strY, endX, endY);

    if (isMove && /(left|right)/i.test(dir)) {
      $wrapper.attr({
        isMove: 1,
        dir: dir,
        changeX: changeX
      });
      var curL = strL + changeX;
      // 边界判断
      curL = curL > maxL ? maxL : (curL < minL ? minL : curL);
      // 设定容器滑动
      $wrapper.css('left', curL);
    }

  };

  var dragEnd = function dragEnd() {

  };

  return {
    init: function () {
      var len = $slideList.length;
      // init css style
      $wrapper.css('width', len * winW);
      $slideList.css('width', winW); // 内置循环赋值
      minL = -(len - 1) * winW;
      lazyImg();
      len = null;

      // swipe bind
      $banner
        .on('touchstart', dragStart)
        .on('touchmove', dragMove)
        .on('touchend', dragEnd);
    }
  }
})();

bannerRender.init();