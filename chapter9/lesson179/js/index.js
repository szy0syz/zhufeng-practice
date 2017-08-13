~function () {
  var desW = 640, // 设计原始稿宽度
    winW = document.documentElement.clientWidth,
    main = document.getElementById('#main'),
    ratio = winW / desW;

  if (winW > desW) {
    main.style.width = desw;
    main.style.margin = '0 auto';
    // document.documentElement.style.fontSize = ratio
    return;
  }

  document.documentElement.style.fontSize = ratio * 100 + 'px';
}();

!function () {
  new Swiper('.swiper-container', {
    direction: 'vertical',
    loop: true
  });
}();