// REM
~function (){
  var desW = 640,
    winW = document.documentElement.clientWidth || document.body.clientWidth;

  if (winW > desW) {
    document.getElementById('container').style.width = desW + 'px';
    // $('.container').css('width', desW); // for 兼容
    return
  }

  document.documentElement.style.fontSize = winW / desW * 100 + 'px';
}();