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

  $header.tap(function (ev) {
    console.log(ev);
  })

}();

// -> matchInfo

var matchInfo = (function () {

  var $matchInfo = $('.macthInfo'),
    $matchInfoTemplate = $('#matchInfoTemplate');

  // -> bind event support
  function bindEvent() {
    var $bottom = $matchInfo.children('.bottom'),
      $bottomLeft = $bottom.children('.home'),
      $bottomRight = $bottom.children('.away');

    // 获取本地存储信息，判断是否有支持
    var support = localStorage.getItem('support');
    if(support) {
      // 如果存在再继续处理
      support = JSON.parse(support);
      if (support.isTap) {
        $bottom.attr('isTap', true);
        // 注意这里通过JSON转换出来后都是字符串了，判断时必须坚持使用===!!!
        support.type === '1' ? $bottomLeft.addClass('bg'):$bottomRight.addClass('bg');
      }
    }

    $matchInfo.tap(function (ev) {
      var tar = ev.target,
        tarTag = tar.tagName,
        tarP = tar.parentNode,
        $tar = $(tar),
        $tarP = $tar.parent(),
        tarInn = $tar.html();

      // 这里nodeName记得要大写
      if (tarTag === 'SPAN' && tarP.className === 'bottom') {
        // 如果你点击的是type就返回
        if (tar.className === 'type') return;

        // 如果已经点击过了，使用自定义属性
        if ($bottom.attr('isTap') === 'true') return;


        // 使所点击方数量+1并且设置样式背景
        $tar.html(parseFloat(tarInn) + 1).addClass('bg');

        // 重新计算进度条
        var leftN = parseFloat($bottomLeft.html()),
          rightN = parseFloat($bottomRight.html());
        // console.log(leftN,rightN, (leftN / (rightN + leftN)) * 100 + '%');
        $matchInfo.children('.middle').children('span').css('width', (leftN / (rightN + leftN)) * 100 + '%');

        // 告诉服务器信息
        $.ajax({ // 注意又用到了事件源，此时经过判断，事件源已经是home和away了！
          url: 'http://matchweb.sports.qq.com/kbs/teamSupport?mid=100000:1468531&type=' + $tar.attr('type'),
          dataType: 'jsonp'
        });

        // 设置自定义属性表示已经投票过！
        $bottom.attr('isTap', true);
        // 设置本地存储
        localStorage.setItem('support', JSON.stringify({
          "isTap": true,
          "type": $tar.attr('type')
        }));

      }


    });
  }


  function bindHtml(matchInfo) {
    var html = new EJS({url: 'template/matchInfo.ejs'}).render(matchInfo);
    $matchInfo.html(html);

    window.setTimeout(function () {
      var leftNum = parseFloat(matchInfo.leftSupport),
        rightNum = parseFloat(matchInfo.rightSupport);
      $matchInfo.children('.middle').children('span').css('width', (leftNum / (leftNum + rightNum)) * 100 + '%');
    }, 300);


  }

  return {
    init: function () {
      // -> get data
      $.ajax({
        url: 'http://matchweb.sports.qq.com/html/matchDetail?mid=100000:1468531',
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

// -> match list
var matchListRender = (function () {

  function bindHTML(data) {
    var $matchList = $('.matchList'),
      $matchListUL = $matchList.children('ul');
    var html = new EJS({url: 'template/matchList.ejs'}).render(data);
    // document.documentElement 仅是移动端有效，PC端无效！document.defaultView.getComputedStyle(document.documentElement)['fontSize']
    // $matchListUL.html(html).css('width', parseFloat(document.documentElement.style.fontSize || document.body.style.fontSize) * 2.4 * data.length + 'px');
    // 为了兼容PC端
    $matchListUL.html(html).css('width', parseFloat(document.defaultView.getComputedStyle(document.documentElement)['fontSize']) * 2.4 * data.length + 18 + 'px');

    new IScroll('.matchList', {
      scrollX: true,
      srcollY: false,
      click: true
    });
  }

  return {
    init: function () {
      $.ajax({
        url: 'http://matchweb.sports.qq.com/html/matchStatV37?mid=100002:2365',
        //url: 'json/matchList.json',
        dataType: 'jsonp',
        success: function (result) {
          if(result && result[0] === 0) {
            result = result[1]['stats'];
            var matchList = null;
            $.each(result, function (index, item) {
               if (item['type'] === '9') {
                 matchList = item['list'];
                 return false;
               }
            });
            // bind html
            bindHTML(matchList);
          }
        }
      });
    }
  }
})();
matchListRender.init();