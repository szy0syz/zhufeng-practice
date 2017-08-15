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