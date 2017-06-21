/**
 * Created by jerry on 2017/6/21.
 */

~function () {
  // 第零步：初始化
  var banner = document.getElementById("banner");
  // var inner = banner.firstChild; // 又掉坑里，要用element不要node，为了兼容用utils
  var inner = utils.firstChild(banner);
  var ul = utils.children(banner, 'ul')[0];
  // test!!!
  // banner.firstElementChild.children[1].offsetParent,
  // test!!!
  // 第一步：远程获取数据
  var data = null,
    count = 0;
  // 重复记忆一遍xhr配置吧：先实例一个xhr对象
  var xhr = new XMLHttpRequest;
  // 配置xhr的open属性
  xhr.open("get", "./json/data.json", true);
  // 兼听onreadystatechange事件
  xhr.onreadystatechange = function handlerXHR() {
    if (xhr.readyState === 4 && /^2\d\d$/.test(xhr.status)) {
      data = utils.jsonParse(xhr.responseText);
      bind(data)
    }
  };
  // 发送请求
  xhr.send(null);

  // 第二步：数据绑定, 整成个函数把，异步就这样，你的满足它~
  function bind(data) {
    var sbImgs = '', // 我还是怀念C#中StringBuild类
        sbLis  = '';
    for (var i = 0, len = data.length; i < len; i++) {
      sbImgs += '<div><img src="'+ data[i]["img"] +'" alt="'+ data[i]["desc"] +'"></div>';
      i === 0 ? sbLis += '<li class="bg"></li>' : sbLis += '<li></li>';
    }
    inner.innerHTML = sbImgs;
    console.log(ul);
    ul.innerHTML = sbLis;
    console.log(ul);
  }

  // 第三步：



}();