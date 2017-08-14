~function () {
  var desW = 640, // 设计原始稿宽度
    winW = document.documentElement.clientWidth,
    main = document.getElementById('#main'),
    ratio = winW / desW;
  
  if (winW > desW) {
    main.style.width = desW + 'px';
    main.style.margin = '0 auto';
    return;
  }
  document.documentElement.style.fontSize = ratio * 100 + 'px';
}();

new Swiper('.swiper-container', {
  direction: 'vertical',
  loop: true,
  onSlideChangeEnd: function (swiper) {
    console.dir(swiper);
    var oSlides = swiper.slides, // 类数据，存的是那些滑动的容器，额外加了两个：一前一后。对了，这里是dom原生带映射的对象哦~~
      index = swiper.activeIndex,
      len = oSlides.length;
    // 好了，该拿的参数都拿了，就看算法了！
    // n 表示设计搞轮播图的第x张，从1开始的！
    // m 表示加了头尾各一张后的数量
    // 第0张时   n 小伙自带prev样式，其实就是设计轮播图的最后一张
    // 第1 张时  1
    // 第2 张时  2
    // 第3 张时  3
    // 第m-1张  n
    // 第m 张时 1
    // 其实m就是swiper.activeIndex了！！
    targetId = 'page';
    switch (index) {
      case 0:
        targetId += len-2;
        break;
      case len:
        targetId += '1';
        break;
      case len-1:
        targetId += len-2;
        break;
      default:
        targetId += index;
    }
    console.log(index, targetId);
    
    for (var i = 0; i < len; i++) {
      if (i === index) {
        oSlides[i].id = targetId;
      } else {
        oSlides[i].id = '';
      }
      
    }
  }
});