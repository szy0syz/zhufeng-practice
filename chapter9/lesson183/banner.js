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
  console.log(document);
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

  return {
    init: function () {
      var len = $slideList.length;
      // init css style
      $wrapper.css('width', len * winW);
      $slideList.css('width', winW); // 内置循环赋值
      minL = (len - 1) * winW;
      lazyImg();
      len = null;
    }
  }
})();

bannerRender.init();