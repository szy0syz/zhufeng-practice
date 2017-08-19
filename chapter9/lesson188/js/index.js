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

  $header.tap(function(ev){
    console.log(ev);
  })

}();

// -> matchInfo

var  matchInfo = (function () {

  var $matchInfo = $('.macthInfo'),
    $matchInfoTemplate = $('#matchInfoTemplate');

  // -> bind event support
  function bindEvent () {
    $matchInfo.tap(function (ev) {
      var tar = ev.target,
        tarTag = tar.tagName,
        tarP = tar.parentNode,
        $tar = $(tar),
        $tarP = $tar.parent(),
        tarInn = $tar.html();

      // 这里nodeName记得要大写
      if(tarTag === 'SPAN' && tarP.className === 'bottom') {

        $tar.html(parseFloat(tarInn) + 1).addClass('bg');
      }


    });
  }


  function bindHtml(matchInfo) {
    var html = new EJS({url: 'template/matchInfo.ejs'}).render(matchInfo);
    $matchInfo.html(html);

    window.setTimeout(function () {
      var leftNum = parseFloat(matchInfo.leftSupport),
        rightNum = parseFloat(matchInfo.rightSupport);
    }, 300);


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
                bindEvent();
              }
            }
        })
    }
  }
})();

matchInfo.init();