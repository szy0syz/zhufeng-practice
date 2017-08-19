// REM
~function () {
  var desW = 640,
    winW = document.documentElement.clientWidth || document.body.clientWidth;
  
  if (winW > desW) {
    document.getElementById('container').style.width = desW + 'px';
    // $('.container').css('width', desW); // for 兼容
    return
  }
  
  document.documentElement.style.fontSize = winW / desW * 100 + 'px';
}();


// -> header
!function () {
  var $header = $('.header'),
    $menu = $header.find('.menu'), // .menu是孙子元素所以要用find
    $nav = $header.children('.nav');
  
  $menu.tap(function () {
    if ($(this).attr('isShow') === '1') {
      $nav.css({
        // padding: '0',
        height: '0'
      });
      // 哈哈，收动画的咯噔终于消失了！哈哈哈哈！
      var timer = setTimeout(function () {
        // 为了消除收动画时padding的咯噔，定时器等动画完成后再把padding设0
        $nav.css('padding', 0);
        window.clearTimeout(timer);
      }, 301);
      $(this).attr('isShow', 0);
      return
    }
    $nav.css({
      padding: '.1rem 0',
      height: '2.22rem'
    });
    $(this).attr('isShow', 1);
  });
  
}();

// -> matchInfo

var  matchInfo = (function () {

  var $matchInfo = $('.macthInfo'),
    $matchInfoTemplate = $('#matchInfoTemplate');

  function bindHtml(matchInfo) {
    // var ttt = EJS.render($matchInfoTemplate.html(), { matchInfo: matchInfo });
    var html = new EJS({url: 'template/matchInfo.ejs'}).render(matchInfo);
    $matchInfo.html(html);
  }

  return {
    init: function () {
        // -> get data
        $.ajax({
            url:'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531',
            dataType: 'jsonp',
            success: function (res) {
              if (res && res[0] === 0) {
                res = res[1];
                var matchInfo = res['matchInfo'];
                matchInfo['leftSupport'] = res['leftSupport'];
                matchInfo['rightSupport'] = res['rightSupport'];

                // -> bind html
                bindHtml(matchInfo);
              }
            }
        })
    }
  }
})();

matchInfo.init();