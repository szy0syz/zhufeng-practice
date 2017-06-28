~function (jQuery) {
  function slider(url, interval) {
    // 第0步：初始化全局变量
    var $banner = this,
      $inner = $banner.children().eq(0),
      $bannerTip = $banner.children().eq(1),
      $bannerLeft = $banner.children().eq(2),
      $bannerRight = $banner.children().eq(3),
      $innerDivs = null,
      $bannerLis = null;
    
    //1. ajax获取数据
    var jsonData = null;
    $.ajax({
      url: url,
      cache: false,
      dataType: 'json',
      async: false,
      success: function (data) {
        jsonData = data;
      }
    });
    
    //2. 绑定数据
    !function bind() {
      var strDivs = '';
      var strUl = '';
      $.each(jsonData, function (i) {
        strDivs += '<div><img src="" rsrc="' + this.img + '" alt="' + this.desc + '"></div>';
        i === 0 ? strUl += '<li class="bg"></li>' : strUl += '<li></li>'; // 为第一个li加上选中样式
      });
      $inner.html(strDivs);
      $bannerTip.html(strUl);
    }(jsonData);
    $innerDivs = $inner.children();
    $bannerLis = $bannerTip.children();
    $bannerLis.each(function (i) {
      $(this).prop("index", i);
    });
    
    //3. 图片延迟加载
    $innerDivs.each(function () {
      var $img = $(this).children().eq(0);
      $img.attr('src', $img.attr('rsrc')).removeAttr('rsrc');  // 假设保证图片地址没问题
    });
    $innerDivs.eq(0).fadeIn(600);
    
    // 4. 实现轮播
    interval = interval || 3000;
    var step = 0, autoTimer = null;
    autoTimer = window.setInterval(autoPlay, interval);
    function autoPlay() {
      step++;
      if (step >= $innerDivs.length) {
        step = 0;
      }
      // 焦点对齐
      $bannerLis.eq(step).addClass('bg').siblings().removeClass('bg');
      //切换轮播图
      $innerDivs.eq(step).finish().fadeIn(600).siblings().finish().fadeOut(600);
    }
    
    //5. 实现焦点切换
    $bannerLis.click(function () {
      var step = $(this).prop("index") - 1;
      autoPlay();
    });
    
    // 6. 实现开始和结束动画与slideNav的显示隐藏
    $banner.on("mouseover", function () {
      $bannerLeft.css("display", "block");
      $bannerRight.css("display", "block");
      window.clearInterval(autoTimer);
      return false; //貌似没控制住势态啊！
    });
    $banner.on("mouseout", function () {
      $bannerLeft.css("display", "none");
      $bannerRight.css("display", "none");
      autoTimer = window.setInterval(autoPlay, interval);
      return false;
    });
    
    //7. 实现左右切换
    $bannerLeft.on("click", function () {
      if (step === 0) {
        step = $innerDivs.length;
      }
      step -= 2;
      autoPlay();
    });
    $bannerRight.on("click", function () {
      autoPlay();
    });
  }
  
  jQuery.fn.extend({
    slider: slider
  })
}(jQuery);