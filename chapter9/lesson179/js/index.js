~function () {
  var desW = 640, // 设计原始稿宽度
    winW = document.documentElement.clientWidth,
    main = document.getElementById('main'),
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
    
    for (var i = 0; i < len; i++) {
      if (i === index) {
        oSlides[i].id = targetId;
      } else {
        oSlides[i].id = '';
      }
    }
  }
});

!function (){
  var audioBox = document.querySelector('.audio'),
    myAudio = audioBox.getElementsByTagName('audio')[0];
    
  // 延迟一秒钟加载
  window.setTimeout(function () {
    myAudio.play(); // 播放起来，但我不知道加载完了没？
    
    // 当这个额音频加载完毕且播放时触发这个事件
    myAudio.addEventListener("canplay", function () {
      audioBox.style.display = 'block';
      audioBox.className += ' audioMove';
    }, false); // 不冒泡
  }, 800);
  
  audioBox.addEventListener('click', function () {
    // 这个paused是状态，如果audio元素处于暂停状态就显示并播放它
    if (myAudio.paused) {
      myAudio.play();
      // 对了 还得让它转起来~~
      audioBox.className = 'audio audioMove';
      return
    }
    myAudio.pause();
    // 小伙别转了~
    audioBox.className = 'audio';
  });
    
}();