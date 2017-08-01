let op = (function () {
  
  let content = document.getElementById('content'),
    page = document.getElementById('page'),
    pageNum = document.getElementById('pageNum'),
    numList = pageNum.getElementsByTagName('li'),
    pageInp = document.getElementById('numInp');
  
  let n = 1,
    total = 1,
    jsonData = null;
  
  const pageClickHandle = function pageClickHandle(e) {
    e = e || window.event;
    const target = e.target || e.srcElement;
    const tagName = target.tagName.toUpperCase();
    let value = target.innerHTML;
    
    // 如果点的是那个input就直接返回，啥也不做
    if (tagName === 'INPUT') {
      return
    }
    
    // 如果点的是那四个伪装按钮span
    if (tagName === 'SPAN') {
      switch (value) {
        case 'FIRST': {
          n = 1;
          break;
        }
        case 'PREV': {
          if (n === 1) {
            // 如果是第一页了，就不再发ajax请求直接返回
            return;
          }
          n--;
          break;
        }
        case 'NEXT': {
          if (n === total) {
            return;
          }
          n++;
          break;
        }
        case 'LAST': {
          n = total;
          break;
        }
        default: {
          n = 1;
        }
      }
      
    }
    
    // 如果点的是那几个页面按键
    if (tagName === 'LI') {
      value = Math.round(parseFloat(value));
      if (isNaN(value)) {
        n = 1;
      } else if (value > total) {
        n = total;
      } else if (value < 1) {
        n = 1;
      } else {
        n = value;
      }
    }
    
    // 最后发送ajax请求，如果有特殊情况已经提前返回！
    sendAJAX();
  };
  
  const bindHTML = function bindHTML(data) {
    let str = '', i = 0;
    
    for (i = 0; i < data.length; i++) {
      str += `
        <li studentId="${data[i].id}">
          <span>${data[i].id}</span>
          <span>${data[i].name}</span>
          <span>${data[i].sex === 0 ? '女' : '男'}</span>
          <span>${data[i].score}</span>
        </li>
      `
    }
    // 表格内容的数据绑定
    content.innerHTML = str;
    
    str = '';
    for (i = 1; i <= total; i++) {
      if (i === n) {
        str += `<li class="bg">${i}</li>`;
        continue;
      }
      str += `<li>${i}</li>`
    }
    // 页码区的数据绑定
    pageNum.innerHTML = str;
    
    pageInp.value = n;
    
  };
  
  const pageInpHandle = function pageInpHandle(e) {
    e = e || window.event;
    const target = e.target || e.srcElement;
    if (e.code === 'Enter') {
      let val = this.value;
      if (isNaN(val)) {
        this.value = 1;
      }
      val = Math.round(parseFloat(val));
      if (val > total) {
        n = total;
      } else if (val < 1) {
        n = 1;
      } else {
        n = val;
      }
      sendAJAX();
    }
  };
  
  const bindEvent = function bindEvent() {
    // 这里的page对象是dom对象，是有映射关系的哦！！！
    page.addEventListener('click', pageClickHandle);
  };
  
  const sendAJAX = function sendAJAX() {
    ajax({
      url: '/getList?n=' + n,
      success: function (data) {
        if (data && data.code === 0) {
          total = data['total'];
          jsonData = data['data'];
          bindHTML(data['data']);
          bindEvent();
          pageInp.addEventListener('keyup', pageInpHandle);
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