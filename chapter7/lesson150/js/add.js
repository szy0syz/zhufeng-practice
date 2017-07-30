(function () {
  const cstName = document.getElementById('cstName'),
    cstAge = document.getElementById('cstAge'),
    cstPhone = document.getElementById('cstPhone'),
    cstAddr = document.getElementById('cstAddr'),
    url = window.location.href;

  let flag = false;

  String.prototype.queryURLParams = function () {
    let obj = {},
      reg = /([^?=&#]+)=([^?=&#]+)/g;
    this.replace(reg, function () {
      // index=0是整个大字符串，肯定不要的
      const key = arguments[1];
      obj[key] = arguments[2];
    });
    return obj;
  };

  function isNumber (val) {
    return typeof val === 'number' && isFinite(val);
  }

  if (url.indexOf('?') > 0) {
    let params = url.queryURLParams();
    if (isNumber(params["id"])) {
      flag = true; // 修改为新增模式
    }
  }

  const submit = function submit() {
    // 修改模式
    if (flag) {
      ajax({
        url: '/addCst',
        type: 'post',
        data: JSON.stringify(obj),
        success: function (d) {
          if (d.code === 0) {
            window.location.href = '/index.html';
            return
          }
          alert('修改客户失败');
        }
      });
      return
    }

    // 添加模式
    let obj = {
      name: cstName.value,
      age: cstAge.value,
      phone: cstPhone.value,
      addr: cstAddr.value
    };

    ajax({
      url: '/addCst',
      type: 'post',
      data: JSON.stringify(obj),
      success: function (d) {
        if (d.code === 0) {
          window.location.href = '/index.html';
          return
        }
        alert('添加客户失败');
      }
    })
  };

  let btnSubmit = document.getElementById('submit');
  btnSubmit.onclick = submit;

})();