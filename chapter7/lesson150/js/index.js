let op = (function () {
  // 声明一些常量
  const baseHost = 'http://127.0.0.1:8000';

  // 数据绑定
  const bind = function bind(data) {
    let list = document.getElementById('list'), sb = '', i = 0, curData = null;
    for (i = 0; i < data.length; i++) {
      curData = data[i];
      sb += `
        <li>
        <span class="w50" >${curData.id}</span>
        <span class="w150">${curData.name}</span>
        <span class="w50" >${curData.age}</span>
        <span class="w200">${curData.phone}</span>
        <span class="w200">${curData.addr}</span>
        <span class="w150 control"><a href="/add?id=${curData.id}">修改</a> | <a href="#">删除</a></span>
        </li>
      `;
    }
    list.innerHTML = sb;
  };

  // init: 初始化首页客户列表信息
  const init = function init() {
    ajax({
      url: baseHost + '/getList',
      success: (d) => {
        if (d.code === 0) {
          console.log(d);
          bind(JSON.parse(d.data));
        }
      }
    })
  };


  return {
    init: init
  }
})();