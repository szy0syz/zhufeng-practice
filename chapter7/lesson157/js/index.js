let op = (function () {
  
  let content = document.getElementById('content'),
    page = document.getElementById('page'),
    pageNum = document.getElementById('pageNum'),
    numList = pageNum.getElementsByTagName('li');
  
  let n = 1,
    total = 1,
    jsonData = null;
  
  const bindHTML = function bindHTML(data) {
    let str = '', i = 0;
    
    for (i = 0; i < data.length; i++) {
      str += `
        <li studentId="${data[i].id}">
          <span>${data[i].id}</span>
          <span>${data[i].name}</span>
          <span>${data[i].sex === 0 ? '女': '男'}</span>
          <span>${data[i].score}</span>
        </li>
      `
    }
    // 字符串拼接，数据绑定
    content.innerHTML = str;
    
    str = '';
    for (i = 1; i <= total; i++) {
      if (i === n) {
        str += `<li class="bg">${i}</li>`;
        continue;
      }
      str += `<li>${i}</li>`
    }
    // 字符串拼接，数据绑定
    pageNum.innerHTML = str;
    
  };
  
  const sendAJAX = function sendAJAX() {
    ajax({
      url: '/getList?n=' + n,
      success: function (data) {
        if (data && data.code === 0) {
          total = data['total'];
          jsonData = data['data'];
          bindHTML(data['data']);
        }
      }
    })
  };
  
  
  const init = function init() {
    sendAJAX();
  };
  
  return {
    init: init
  }
})();

op.init();