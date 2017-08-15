// REM
!function () {
  //设置rem=当前屏幕宽度除以设计稿宽度640*100+'px'
  document.documentElement.style.fontSize = document.documentElement.clientWidth / 640 * 100 + 'px';
}();


var bannerRender = (function (){
  //先获取当前屏幕宽度
  var winW = document.documentElement.clientWidth;
  console.log(document);
  var $banner = $('.banner'),
    $wrapper = $banner.children('.wrapper'),
    $slideList = $wrapper.children('.slide'),
    $imgList = $wrapper.children('img');
  
  return {
    init: function () {
      // init cee style
      $wrapper.css('width', $slideList.length * winW);
      $slideList.css('width', winW); // 内置循环赋值
      
    }
  }
})();

bannerRender.init();